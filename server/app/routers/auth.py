from fastapi import APIRouter

from app.schemas.user import UserRegister, UserLogin
from app.schemas.token import Token
from app.services.auth_service import (
    hash_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(user: UserRegister):

    hashed_password = hash_password(user.password)

    return {
        "message": "User registered successfully",
        "user": {
            "full_name": user.full_name,
            "email": user.email,
            "hashed_password": hashed_password,
        },
    }


@router.post("/login", response_model=Token)
def login(user: UserLogin):

    access_token = create_access_token(
        {"sub": user.email}
    )

    return Token(
        access_token=access_token
    )