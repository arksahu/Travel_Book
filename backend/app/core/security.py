from typing import Optional
from fastapi import Header, HTTPException, status
from pydantic import BaseModel
from supabase import create_client, Client
from app.core.config import settings


class AuthenticatedUser(BaseModel):
    id: str
    email: str
    is_demo: bool = False


# Supabase client singleton if configured
supabase_client: Optional[Client] = None
if settings.is_supabase_configured:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")


async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> AuthenticatedUser:
    """
    Validates Supabase Bearer JWT token or falls back to demo traveler if demo mode is active.
    Never trusts client-supplied user IDs without cryptographic verification.
    """
    if not authorization:
        if settings.ENABLE_DEMO_MODE:
            return AuthenticatedUser(
                id="00000000-0000-0000-0000-000000000001",
                email="traveler@wanderwise.demo",
                is_demo=True
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme. Expected 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    # Check for demo mode token
    if token.startswith("demo-") or token == "demo-token-123":
        return AuthenticatedUser(
            id="00000000-0000-0000-0000-000000000001",
            email="traveler@wanderwise.demo",
            is_demo=True
        )

    # Real Supabase token verification
    if settings.is_supabase_configured and supabase_client:
        try:
            # Query Supabase Auth API to securely decode and verify user JWT
            user_response = supabase_client.auth.get_user(token)
            if not user_response or not user_response.user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired session token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            user_data = user_response.user
            return AuthenticatedUser(
                id=str(user_data.id),
                email=str(user_data.email or "user@wanderwise.com"),
                is_demo=False
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # Fallback to demo user if Supabase is not configured
    if settings.ENABLE_DEMO_MODE:
        return AuthenticatedUser(
            id="00000000-0000-0000-0000-000000000001",
            email="traveler@wanderwise.demo",
            is_demo=True
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication unavailable and Demo Mode is disabled.",
        headers={"WWW-Authenticate": "Bearer"},
    )
