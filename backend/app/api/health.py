from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Returns server operational status, environment, and cloud service configuration flags.
    """
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        supabase_configured=settings.is_supabase_configured,
        ai_configured=settings.is_ai_configured,
        ai_provider=settings.AI_PROVIDER
    )
