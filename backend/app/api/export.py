from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from app.core.security import get_current_user, AuthenticatedUser
from app.api.trips import DEMO_TRIPS_STORE
from app.services.export_service import ExportService

router = APIRouter(prefix="/api/trips", tags=["Export"])


@router.post("/{trip_id}/export", response_class=HTMLResponse)
async def export_itinerary_html(
    trip_id: str,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Renders clean standalone HTML ready for printing or PDF export.
    """
    trip = DEMO_TRIPS_STORE.get(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )

    html_content = ExportService.generate_html_itinerary(trip)
    return HTMLResponse(content=html_content, status_code=200)
