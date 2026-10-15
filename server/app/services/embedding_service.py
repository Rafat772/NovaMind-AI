import math
import logging
import re
from typing import List, Optional
import numpy as np

from app.core.config import settings

logger = logging.getLogger("novamind.embeddings")

# Gemini Client singleton if key available
_gemini_client = None

def get_gemini_client():
    global _gemini_client
    if _gemini_client is None and settings.GEMINI_API_KEY:
        try:
            from google import genai
            _gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        except Exception as e:
            logger.warning(f"Could not initialize Google GenAI Client: {e}")
            _gemini_client = None
    return _gemini_client


def local_embedding(text: str, dim: int = 256) -> List[float]:
    """
    Fast, reliable local semantic vectorizer based on subword hashing and normalized frequencies.
    Used when GEMINI_API_KEY is not configured or as resilient fallback.
    """
    vector = np.zeros(dim, dtype=np.float32)
    clean_text = text.lower()
    words = re.findall(r"\b\w+\b", clean_text)
    
    if not words:
        return [0.0] * dim

    for w in words:
        h1 = hash(w) % dim
        vector[h1] += 1.0
        # Character n-grams for morphology
        for n in range(3, min(len(w) + 1, 6)):
            for i in range(len(w) - n + 1):
                ngram = w[i : i + n]
                h_ng = hash(ngram) % dim
                vector[h_ng] += 0.35

    # L2 normalize
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    return vector.tolist()


def generate_single_embedding(text: str) -> List[float]:
    """
    Generates embedding for a single text using Gemini embedding models or local fallback.
    """
    client = get_gemini_client()
    if client:
        for m in ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"]:
            try:
                response = client.models.embed_content(
                    model=m,
                    contents=text,
                )
                if response.embeddings and len(response.embeddings) > 0:
                    return response.embeddings[0].values
            except Exception as err:
                logger.warning(f"Embedding model {m} failed: {err}")
                continue

    return local_embedding(text)


def generate_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generates embeddings for a batch of texts.
    Uses Gemini API if available, else local embedding.
    """
    if not texts:
        return []

    client = get_gemini_client()
    if client:
        for m in ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"]:
            try:
                response = client.models.embed_content(
                    model=m,
                    contents=texts,
                )
                if response.embeddings and len(response.embeddings) == len(texts):
                    return [e.values for e in response.embeddings]
            except Exception as err:
                logger.warning(f"Batch embedding model {m} failed: {err}")
                continue

    return [local_embedding(t) for t in texts]



def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Computes cosine similarity between two float vectors.
    Returns float score between -1.0 and 1.0 (clamped to 0.0 to 1.0 for search ranking).
    """
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0

    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    try:
        dot_product = float(np.dot(a, b))
        sim = dot_product / (norm_a * norm_b)
        return max(0.0, min(1.0, float(sim)))
    except Exception:
        return 0.0
