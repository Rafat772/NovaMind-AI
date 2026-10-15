from datetime import datetime, timedelta, timezone
from typing import Optional
from bson import ObjectId
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.database import db

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def hash_password(password: str) -> str:
    """Hash a plain text password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT access token."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def format_user_response(user_doc: dict) -> dict:
    """Format MongoDB user document for UserResponse."""
    return {
        "id": str(user_doc["_id"]),
        "full_name": user_doc.get("full_name", ""),
        "email": user_doc.get("email", ""),
        "avatar_url": user_doc.get("avatar_url"),
        "auth_provider": user_doc.get("auth_provider", "local"),
        "created_at": user_doc.get("created_at"),
    }


async def get_user_by_email(email: str) -> Optional[dict]:
    """Fetch user document by email from MongoDB."""
    user = await db.users.find_one({"email": email.lower().strip()})
    return user


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Fetch user document by ID from MongoDB."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user
    except Exception:
        return None


async def create_user(full_name: str, email: str, password: str) -> dict:
    """Create a new user in MongoDB."""
    clean_email = email.lower().strip()
    hashed = hash_password(password)

    user_dict = {
        "full_name": full_name.strip(),
        "email": clean_email,
        "hashed_password": hashed,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return user_dict


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Verify user credentials."""
    user = await get_user_by_email(email)
    if not user:
        return None
    if not user.get("hashed_password"):
        # Account registered via OAuth (e.g. Google) without password
        return None
    if not verify_password(password, user.get("hashed_password", "")):
        return None
    return user


def verify_google_credential(credential: str) -> dict:
    """Verifies a Google ID token and returns payload data."""
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    from fastapi import HTTPException, status

    try:
        # If GOOGLE_CLIENT_ID is configured, verify against it; otherwise verify signature
        audience = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
        id_info = id_token.verify_oauth2_token(
            credential, google_requests.Request(), audience=audience
        )
        return id_info
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google token verification failed: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not authenticate with Google: {str(e)}",
        )


async def authenticate_or_register_google_user(credential: str) -> dict:
    """
    Verifies Google ID token and finds or creates a user account.
    """
    from fastapi import HTTPException, status

    id_info = verify_google_credential(credential)
    email = id_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not provide an email address.",
        )

    clean_email = email.lower().strip()
    full_name = id_info.get("name") or clean_email.split("@")[0]
    google_id = id_info.get("sub")
    avatar_url = id_info.get("picture")

    # Check if user already exists
    user = await get_user_by_email(clean_email)

    if user:
        # Update google_id and avatar if missing
        update_fields = {}
        if not user.get("google_id") and google_id:
            update_fields["google_id"] = google_id
        if avatar_url and not user.get("avatar_url"):
            update_fields["avatar_url"] = avatar_url

        if update_fields:
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": update_fields},
            )
            user.update(update_fields)

        return user

    # Otherwise create new Google user
    new_user = {
        "full_name": full_name.strip(),
        "email": clean_email,
        "hashed_password": None,
        "google_id": google_id,
        "avatar_url": avatar_url,
        "auth_provider": "google",
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return new_user