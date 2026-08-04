from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "NovaMind AI Backend is running successfully 🚀"
    }