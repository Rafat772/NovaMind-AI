from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
from app.schemas.report import (
    ReportAnalyticsResponse,
    GenerateReportRequest,
    GeneratedReportResponse,
)
from app.services.report_service import (
    get_user_analytics,
    generate_synthesis_report,
)

router = APIRouter(
    prefix="/reports",
    tags=["Research Reports & Analytics"],
)


@router.get("/analytics", response_model=ReportAnalyticsResponse)
async def get_analytics(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Get comprehensive research analytics:
    - Knowledge base overview
    - Real weekly activity distribution
    - Recent activity history feed
    """
    analytics = await get_user_analytics(current_user.id)
    return ReportAnalyticsResponse(**analytics)


@router.post("/generate", response_model=GeneratedReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    req: GenerateReportRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Generate an executive AI research synthesis report covering indexed literature.
    """
    report = await generate_synthesis_report(
        user_id=current_user.id,
        title=req.title,
        document_id=req.document_id,
    )
    return GeneratedReportResponse(**report)
