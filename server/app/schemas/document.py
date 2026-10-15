from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    chunk_index: int
    page_number: Optional[int] = None
    content: str
    char_count: int


class DocumentBase(BaseModel):
    filename: str
    file_size: int
    file_type: str


class DocumentResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    stored_filename: str
    file_size: int
    file_type: str
    status: str = "uploaded"  # uploaded, processing, ready, failed
    error_message: Optional[str] = None
    page_count: int = 0
    chunk_count: int = 0
    total_characters: int = 0
    created_at: datetime
    updated_at: datetime


class DocumentDetailResponse(DocumentResponse):
    chunks: List[DocumentChunk] = []


class DocumentListResponse(BaseModel):
    total: int
    documents: List[DocumentResponse]


class DocumentStatsResponse(BaseModel):
    total_documents: int
    total_chunks: int
    total_size_bytes: int
    ready_count: int


class SemanticSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    document_id: Optional[str] = None
    top_k: int = Field(default=5, ge=1, le=20)


class SearchResultItem(BaseModel):
    document_id: str
    filename: str
    chunk_index: int
    page_number: Optional[int] = None
    content: str
    score: float


class SemanticSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResultItem]

