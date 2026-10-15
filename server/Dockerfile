# NovaMind AI - Production Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose port (default 8000)
EXPOSE 8000

# Run uvicorn server in production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
