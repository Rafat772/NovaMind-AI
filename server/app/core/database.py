from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)

db = client[settings.DATABASE_NAME]

async def check_db():
    await client.admin.command("ping")
    print("✅ MongoDB Connected Successfully")