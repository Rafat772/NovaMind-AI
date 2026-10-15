from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Citation(BaseModel):
    document_id: str
    filename: str
    chunk_index: int
    page_number: Optional[int] = None
    snippet: str
    score: float


class ChatMessage(BaseModel):
    id: str
    role: str  # "user" or "assistant"
    content: str
    citations: List[Citation] = []
    created_at: datetime


class ChatSessionCreate(BaseModel):
    title: Optional[str] = Field(default="New Research Chat", max_length=120)


class ChatSessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message_count: int = 0
    created_at: datetime
    updated_at: datetime


class SendMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = None
    document_id: Optional[str] = None


class SendMessageResponse(BaseModel):
    session_id: str
    user_message: ChatMessage
    assistant_message: ChatMessage
