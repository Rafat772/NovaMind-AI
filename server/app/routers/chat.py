from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
from app.schemas.chat import (
    ChatMessage,
    ChatSessionCreate,
    ChatSessionResponse,
    SendMessageRequest,
    SendMessageResponse,
    TranslationRequest,
    TranslationResponse,
)
from app.services.chat_service import (
    create_chat_session,
    get_user_chat_sessions,
    get_session_messages,
    delete_chat_session,
    send_chat_message,
    translate_research_text,
)

router = APIRouter(
    prefix="/chat",
    tags=["Research Chat & Synthesis"],
)


@router.post("/message", response_model=SendMessageResponse)
async def post_message(
    payload: SendMessageRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Send a question or query.
    Retrieves grounded context from knowledge base, synthesizes response via Gemini,
    and returns assistant message with citations.
    """
    response = await send_chat_message(
        user_id=current_user.id,
        message=payload.message,
        session_id=payload.session_id,
        document_id=payload.document_id,
    )
    return SendMessageResponse(
        session_id=response["session_id"],
        user_message=ChatMessage(**response["user_message"]),
        assistant_message=ChatMessage(**response["assistant_message"]),
    )


@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_sessions(
    current_user: UserResponse = Depends(get_current_user),
):
    """List all research chat sessions for the current user."""
    sessions = await get_user_chat_sessions(current_user.id)
    return [ChatSessionResponse(**s) for s in sessions]


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    payload: ChatSessionCreate,
    current_user: UserResponse = Depends(get_current_user),
):
    """Create a new research chat session."""
    session = await create_chat_session(current_user.id, payload.title)
    return ChatSessionResponse(**session)


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessage])
async def get_messages(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """Get all messages and citations for a specific chat session."""
    messages = await get_session_messages(session_id, current_user.id)
    return [ChatMessage(**m) for m in messages]


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """Delete a chat session and all its messages."""
    success = await delete_chat_session(session_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or already deleted.",
        )
    return {"success": True, "message": "Chat session deleted.", "id": session_id}


@router.post("/translate", response_model=TranslationResponse)
async def translate_text_endpoint(
    payload: TranslationRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Translates research output into the target language using Gemini.
    """
    try:
        translated = translate_research_text(payload.text, payload.target_language)
        return TranslationResponse(
            original_text=payload.text,
            target_language=payload.target_language,
            translated_text=translated,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )

