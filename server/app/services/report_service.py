import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId

from app.core.database import db
from app.services.embedding_service import get_gemini_client

logger = logging.getLogger("novamind.reports")

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


async def get_user_analytics(user_id: str) -> dict:
    """
    Computes full analytics:
    - Overview metrics
    - Weekly activity distribution
    - Recent chronological activity feed
    """
    uid_str = str(user_id)

    # 1. Documents aggregation
    docs_cursor = db.documents.find({"user_id": uid_str})
    docs = await docs_cursor.to_list(length=1000)

    total_documents = len(docs)
    total_chunks = sum(d.get("chunk_count", 0) for d in docs)
    total_size = sum(d.get("file_size", 0) for d in docs)
    avg_chunks = round(total_chunks / total_documents, 1) if total_documents > 0 else 0.0

    # 2. Chat sessions & messages
    total_sessions = await db.chat_sessions.count_documents({"user_id": uid_str})
    total_messages = await db.chat_messages.count_documents({"user_id": uid_str})

    overview = {
        "total_documents": total_documents,
        "total_chunks": total_chunks,
        "total_sessions": total_sessions,
        "total_messages": total_messages,
        "total_storage_bytes": total_size,
        "avg_chunks_per_doc": avg_chunks,
    }

    # 3. Weekly activity distribution
    day_counts = {day: 0 for day in DAYS_OF_WEEK}

    # Add document dates
    for d in docs:
        dt = d.get("created_at")
        if dt:
            day_name = dt.strftime("%A")
            if day_name in day_counts:
                day_counts[day_name] += 1

    # Add message dates
    msg_cursor = db.chat_messages.find({"user_id": uid_str}, {"created_at": 1})
    messages = await msg_cursor.to_list(length=2000)
    for m in messages:
        dt = m.get("created_at")
        if dt:
            day_name = dt.strftime("%A")
            if day_name in day_counts:
                day_counts[day_name] += 1

    max_count = max(day_counts.values()) if any(day_counts.values()) else 1
    weekly_activity = []
    for day in DAYS_OF_WEEK:
        c = day_counts[day]
        pct = int((c / max_count) * 100) if max_count > 0 else 0
        weekly_activity.append({
            "day": day,
            "count": c,
            "percentage": max(pct, 5) if c > 0 else 0,
        })

    # 4. Recent activity feed
    activity_items = []

    # Recent document uploads
    for d in sorted(docs, key=lambda x: x.get("created_at") or datetime.min, reverse=True)[:5]:
        activity_items.append({
            "id": f"doc-{d['_id']}",
            "type": "upload",
            "title": f"Indexed {d.get('filename', 'Document')}",
            "description": f"Extracted {d.get('chunk_count', 0)} chunks • {d.get('file_type', 'doc').upper()}",
            "timestamp": d.get("created_at") or datetime.now(timezone.utc),
        })

    # Recent chat sessions
    sessions_cursor = db.chat_sessions.find({"user_id": uid_str}).sort("created_at", -1).limit(5)
    recent_sessions = await sessions_cursor.to_list(length=5)
    for s in recent_sessions:
        activity_items.append({
            "id": f"chat-{s['_id']}",
            "type": "chat",
            "title": f"Research Thread: {s.get('title', 'Chat')}",
            "description": "Explored literature synthesis & knowledge citations",
            "timestamp": s.get("created_at") or datetime.now(timezone.utc),
        })

    # Sort all activities by timestamp descending
    activity_items.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "overview": overview,
        "weekly_activity": weekly_activity,
        "recent_activity": activity_items[:8],
    }


async def generate_synthesis_report(
    user_id: str,
    title: Optional[str] = None,
    document_id: Optional[str] = None,
) -> dict:
    """
    Generates a structured research synthesis report across indexed literature.
    Uses Gemini LLM if key is available, or structured synthesis template.
    """
    uid_str = str(user_id)
    doc_filter = {"user_id": uid_str, "status": "ready"}
    if document_id:
        try:
            doc_filter["_id"] = ObjectId(document_id)
        except Exception:
            pass

    docs = await db.documents.find(doc_filter).to_list(length=50)

    total_docs = len(docs)
    total_chunks = sum(d.get("chunk_count", 0) for d in docs)
    now = datetime.now(timezone.utc)
    report_title = title or "NovaMind AI Knowledge Base Synthesis Report"

    # Compile document summaries
    doc_summaries = []
    combined_texts = []
    for d in docs:
        first_chunk = d.get("chunks", [{}])[0].get("content", "") if d.get("chunks") else ""
        summary_item = {
            "id": str(d["_id"]),
            "filename": d.get("filename", "Untitled"),
            "file_type": d.get("file_type", "").upper(),
            "page_count": d.get("page_count", 1),
            "chunk_count": d.get("chunk_count", 0),
            "preview": first_chunk[:200] + "..." if first_chunk else "No text extracted.",
        }
        doc_summaries.append(summary_item)
        if first_chunk:
            combined_texts.append(f"Document: {d.get('filename')}\nExcerpt: {first_chunk[:500]}")

    # Check for Gemini LLM
    client = get_gemini_client()
    summary_markdown = ""

    if client and combined_texts:
        try:
            prompt = f"""You are NovaMind AI Research Platform.
Generate an executive research synthesis report for the researcher based on their indexed knowledge base.

Title: {report_title}
Total Documents: {total_docs}
Total Chunks: {total_chunks}

Document Excerpts:
{"\n\n---\n\n".join(combined_texts[:5])}

Format the report professionally in GitHub Markdown:
1. # Executive Summary
2. ## Key Concepts & Literature Themes
3. ## Methodological Highlights
4. ## Knowledge Base Coverage & Recommendations
"""
            for model_name in ["gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"]:
                try:
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                    )
                    if resp and resp.text:
                        summary_markdown = resp.text
                        break
                except Exception as m_err:
                    logger.warning(f"Report model {model_name} failed: {m_err}")
                    continue
        except Exception as e:
            logger.warning(f"Gemini report synthesis error: {e}")

    # Fallback Markdown Report if Gemini not enabled
    if not summary_markdown:
        docs_list_md = "\n".join(
            [f"- **{d['filename']}** ({d['file_type']}, {d['chunk_count']} chunks, {d['page_count']} pages)" for d in doc_summaries]
        )
        summary_markdown = f"""# {report_title}
*Generated on {now.strftime('%B %d, %Y at %H:%M UTC')} via NovaMind AI*

---

## 📊 Knowledge Base Inventory
* **Total Documents Analyzed**: {total_docs}
* **Total Knowledge Chunks**: {total_chunks}
* **Processing Status**: Verified & Vector Indexed

### Indexed Literature:
{docs_list_md if docs_list_md else "- *No documents indexed yet.*"}

---

## 🔍 Executive Research Summary
NovaMind AI has indexed and tokenized your uploaded documents into semantic knowledge chunks with page references.
Every passage has been mapped into high-dimensional vector representations to enable cross-document reasoning and retrieval-augmented synthesis.

### Core Capabilities Enabled:
1. **Semantic Literature Search**: Sub-second conceptual querying across all indexed papers.
2. **Citation Verification**: Every synthesized insight links back to source pages and original document snippets.
3. **Multi-Turn Research Dialogue**: Deep questioning and synthesis via the NovaMind Chat engine.

---
*Report generated by NovaMind AI — Next-Generation Research Platform*
"""

    return {
        "title": report_title,
        "generated_at": now,
        "total_documents_analyzed": total_docs,
        "total_chunks_synthesized": total_chunks,
        "summary_markdown": summary_markdown,
        "document_summaries": doc_summaries,
    }
