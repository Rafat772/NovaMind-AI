from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class AnalyticsOverview(BaseModel):
    total_documents: int = 0
    total_chunks: int = 0
    total_sessions: int = 0
    total_messages: int = 0
    total_storage_bytes: int = 0
    avg_chunks_per_doc: float = 0.0


class ActivityItem(BaseModel):
    id: str
    type: str  # "upload", "chat", "search"
    title: str
    description: str
    timestamp: datetime


class DayActivity(BaseModel):
    day: str
    count: int
    percentage: int


class ReportAnalyticsResponse(BaseModel):
    overview: AnalyticsOverview
    weekly_activity: List[DayActivity]
    recent_activity: List[ActivityItem]


class GenerateReportRequest(BaseModel):
    title: Optional[str] = "NovaMind AI Literature Synthesis Report"
    document_id: Optional[str] = None


class GeneratedReportResponse(BaseModel):
    title: str
    generated_at: datetime
    total_documents_analyzed: int
    total_chunks_synthesized: int
    summary_markdown: str
    document_summaries: List[dict]
