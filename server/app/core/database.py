import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("novamind.database")

client = AsyncIOMotorClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,
)
db = client[settings.DATABASE_NAME]


async def check_db():
    global client, db
    try:
        await client.admin.command("ping")
        # Ensure unique index on users.email
        await db.users.create_index("email", unique=True)
        # Ensure index on documents.user_id
        await db.documents.create_index([("user_id", 1), ("created_at", -1)])
        # Ensure indices for chat
        await db.chat_sessions.create_index([("user_id", 1), ("updated_at", -1)])
        await db.chat_messages.create_index([("session_id", 1), ("created_at", 1)])
        print(f"[SUCCESS] MongoDB Connected Successfully to '{settings.DATABASE_NAME}'")
        return True
    except Exception as e:
        print(f"[WARNING] Primary MongoDB connection failed: {e}")
        # Try local fallback if not already on localhost
        if "127.0.0.1" not in settings.MONGODB_URL and "localhost" not in settings.MONGODB_URL:
            try:
                print("[INFO] Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017)...")
                client = AsyncIOMotorClient("mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=3000)
                db = client[settings.DATABASE_NAME]
                await client.admin.command("ping")
                await db.users.create_index("email", unique=True)
                print(f"[SUCCESS] Fallback local MongoDB Connected Successfully to '{settings.DATABASE_NAME}'")
                return True
            except Exception as fallback_err:
                print(f"[ERROR] Fallback MongoDB failed: {fallback_err}")
        return False