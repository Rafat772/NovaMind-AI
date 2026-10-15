import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from bson import ObjectId

from app.core.config import settings
from app.core.database import db
from app.services.document_service import semantic_search_chunks
from app.services.embedding_service import get_gemini_client

logger = logging.getLogger("novamind.chat")


def format_message_response(msg: dict) -> dict:
    """Formats MongoDB message document into ChatMessage response format."""
    return {
        "id": str(msg["_id"]),
        "role": msg.get("role", "assistant"),
        "content": msg.get("content", ""),
        "citations": msg.get("citations", []),
        "created_at": msg.get("created_at") or datetime.now(timezone.utc),
    }


def format_session_response(session: dict, message_count: int = 0) -> dict:
    """Formats MongoDB session document into ChatSessionResponse format."""
    return {
        "id": str(session["_id"]),
        "user_id": str(session.get("user_id")),
        "title": session.get("title", "Research Chat"),
        "message_count": message_count,
        "created_at": session.get("created_at") or datetime.now(timezone.utc),
        "updated_at": session.get("updated_at") or datetime.now(timezone.utc),
    }


async def create_chat_session(user_id: str, title: Optional[str] = None) -> dict:
    """Creates a new research conversation session."""
    now = datetime.now(timezone.utc)
    session_data = {
        "user_id": str(user_id),
        "title": (title or "New Research Chat").strip()[:100],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.chat_sessions.insert_one(session_data)
    session_data["_id"] = result.inserted_id
    return format_session_response(session_data, message_count=0)


async def get_user_chat_sessions(user_id: str) -> List[dict]:
    """Retrieves all chat sessions for a user, newest first."""
    cursor = db.chat_sessions.find({"user_id": str(user_id)}).sort("updated_at", -1)
    sessions = await cursor.to_list(length=100)

    formatted = []
    for s in sessions:
        count = await db.chat_messages.count_documents({"session_id": str(s["_id"])})
        formatted.append(format_session_response(s, message_count=count))

    return formatted


async def get_session_messages(session_id: str, user_id: str) -> List[dict]:
    """Fetches full message history of a specific session."""
    # Ensure session belongs to user
    try:
        oid = ObjectId(session_id)
    except Exception:
        return []

    session = await db.chat_sessions.find_one({"_id": oid, "user_id": str(user_id)})
    if not session:
        return []

    cursor = db.chat_messages.find({"session_id": str(session_id)}).sort("created_at", 1)
    messages = await cursor.to_list(length=500)
    return [format_message_response(m) for m in messages]


async def delete_chat_session(session_id: str, user_id: str) -> bool:
    """Deletes a session and all its associated messages."""
    try:
        oid = ObjectId(session_id)
    except Exception:
        return False

    session = await db.chat_sessions.find_one({"_id": oid, "user_id": str(user_id)})
    if not session:
        return False

    await db.chat_messages.delete_many({"session_id": str(session_id)})
    await db.chat_sessions.delete_one({"_id": oid})
    return True


def generate_llm_response(query: str, context_chunks: List[dict]) -> str:
    """
    Synthesizes an intelligent, grounded response using Google Gemini LLM,
    or a structured grounded fallback when API key is pending.
    """
    client = get_gemini_client()

    # Format context for prompt
    context_text = ""
    if context_chunks:
        formatted_passages = []
        for idx, chunk in enumerate(context_chunks):
            source_info = f"Source [{idx + 1}]: {chunk['filename']}"
            if chunk.get("page_number"):
                source_info += f" (Page {chunk['page_number']})"
            formatted_passages.append(f"{source_info}\nPassage: {chunk['content']}")
        context_text = "\n\n---\n\n".join(formatted_passages)

    if client:
        try:
            prompt = f"""You are NovaMind AI, an elite research assistant and knowledge synthesis platform.
Answer the user's research query accurately and comprehensively.

Instructions:
1. Ground your answer in the Verified Research Sources provided below whenever relevant.
2. Direct inline citations: Cite sources directly in your response using tags like [Source: Filename, Page X].
3. Format your response cleanly using Markdown (use bold headings, bullet points, and code blocks where helpful).
4. If the provided sources do not fully answer the question, clearly state what was found in the indexed literature and provide accurate general knowledge.

Verified Research Sources from Knowledge Base:
{context_text if context_text else "No uploaded documents match this query."}

Researcher Query:
{query}
"""
            # Try modern Gemini Flash models supported by the API (lite first for high availability)
            for model_name in ["gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"]:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                    if response and response.text:
                        return response.text
                except Exception as m_err:
                    logger.warning(f"Model {model_name} failed: {m_err}")
                    continue
        except Exception as e:
            logger.error(f"Gemini LLM generation failed: {e}", exc_info=True)

    # Grounded fallback synthesis when Gemini API key is not yet set
    if context_chunks:
        top_chunk = context_chunks[0]
        summary_intro = (
            f"### Research Synthesis (Grounded Retrieval)\n\n"
            f"Based on your indexed literature, here are the most relevant findings regarding **\"{query}\"**:\n\n"
        )
        points = []
        for i, c in enumerate(context_chunks[:3]):
            page_ref = f" (Page {c['page_number']})" if c.get('page_number') else ""
            clean_snippet = c['content'].strip().replace("\n", " ")
            if len(clean_snippet) > 280:
                clean_snippet = clean_snippet[:280] + "..."
            points.append(f"* **{c['filename']}{page_ref}** — [Match: {int(c['score'] * 100)}%]\n  > \"{clean_snippet}\"\n")

        synthesis_body = "\n".join(points)
        note = (
            "\n\n> 💡 **Tip**: Add your `GEMINI_API_KEY` to `server/.env` to unlock generative multi-paragraph AI synthesis and reasoning!"
        )
        return summary_intro + synthesis_body + note

    return (
        f"I searched your indexed research documents for **\"{query}\"**, but did not find high-confidence matching passages.\n\n"
        "Try uploading relevant research papers or phrasing your query using specific concepts."
    )


async def send_chat_message(
    user_id: str,
    message: str,
    session_id: Optional[str] = None,
    document_id: Optional[str] = None,
) -> dict:
    """
    Main RAG workflow:
    1. Retrieve or create session
    2. Perform semantic search over knowledge base
    3. Generate LLM synthesis grounded in sources
    4. Save user & assistant messages with citations
    """
    now = datetime.now(timezone.utc)

    # 1. Ensure or create session
    active_session_id = session_id
    if not active_session_id:
        title = message.strip()[:40] + ("..." if len(message.strip()) > 40 else "")
        session = await create_chat_session(user_id=user_id, title=title)
        active_session_id = session["id"]
    else:
        # Update session updated_at
        try:
            await db.chat_sessions.update_one(
                {"_id": ObjectId(active_session_id), "user_id": str(user_id)},
                {"$set": {"updated_at": now}},
            )
        except Exception:
            pass

    # 2. Save User Message
    user_msg_doc = {
        "session_id": str(active_session_id),
        "user_id": str(user_id),
        "role": "user",
        "content": message.strip(),
        "citations": [],
        "created_at": now,
    }
    user_msg_res = await db.chat_messages.insert_one(user_msg_doc)
    user_msg_doc["_id"] = user_msg_res.inserted_id

    # 3. Retrieve relevant context via Phase 3 Semantic Search
    search_results = await semantic_search_chunks(
        user_id=user_id,
        query=message,
        document_id=document_id,
        top_k=4,
    )

    # Build citations list
    citations = []
    for r in search_results:
        citations.append({
            "document_id": r["document_id"],
            "filename": r["filename"],
            "chunk_index": r["chunk_index"],
            "page_number": r.get("page_number"),
            "snippet": r["content"][:240] + ("..." if len(r["content"]) > 240 else ""),
            "score": r["score"],
        })

    # 4. Generate LLM Answer
    assistant_content = generate_llm_response(message, search_results)

    # 5. Save Assistant Message
    assistant_now = datetime.now(timezone.utc)
    assistant_msg_doc = {
        "session_id": str(active_session_id),
        "user_id": str(user_id),
        "role": "assistant",
        "content": assistant_content,
        "citations": citations,
        "created_at": assistant_now,
    }
    assistant_msg_res = await db.chat_messages.insert_one(assistant_msg_doc)
    assistant_msg_doc["_id"] = assistant_msg_res.inserted_id

    return {
        "session_id": str(active_session_id),
        "user_message": format_message_response(user_msg_doc),
        "assistant_message": format_message_response(assistant_msg_doc),
    }
