from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    auth_provider: Optional[str] = "local"
    created_at: Optional[datetime] = None


class GoogleAuthRequest(BaseModel):
    credential: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=128)