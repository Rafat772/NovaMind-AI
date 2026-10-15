from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.user import UserRegister, UserLogin, UserResponse, GoogleAuthRequest
from app.schemas.token import Token
from app.services.auth_service import (
    create_access_token,
    get_user_by_email,
    create_user,
    authenticate_user,
    format_user_response,
    authenticate_or_register_google_user,
)
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    new_user = await create_user(
        full_name=user_data.full_name,
        email=user_data.email,
        password=user_data.password,
    )

    access_token = create_access_token({"sub": new_user["email"]})
    user_resp = UserResponse(**format_user_response(new_user))

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_resp,
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await authenticate_user(credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user["email"]})
    user_resp = UserResponse(**format_user_response(user))

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_resp,
    )


@router.post("/google", response_model=Token)
async def google_auth(request_data: GoogleAuthRequest):
    """
    Authenticate or register a user using Google OAuth ID Token.
    Returns standard NovaMind JWT access token and user profile.
    """
    user = await authenticate_or_register_google_user(request_data.credential)
    access_token = create_access_token({"sub": user["email"]})
    user_resp = UserResponse(**format_user_response(user))

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_resp,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user