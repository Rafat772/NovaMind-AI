import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
from app.schemas.document import (
    DocumentResponse,
    DocumentDetailResponse,
    DocumentListResponse,
    DocumentStatsResponse,
    SemanticSearchRequest,
    SearchResultItem,
    SemanticSearchResponse,
    DocumentCompareRequest,
    DocumentCompareResponse,
)
from app.services.document_service import (
    save_and_create_document,
    process_document_content,
    get_user_documents,
    get_document_by_id,
    delete_document,
    get_document_stats,
    format_doc_response,
    semantic_search_chunks,
    reindex_document,
    compare_documents,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents & Knowledge Base"],
)


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Upload a document (PDF, DOCX, TXT, MD), validate its extension and size,
    extract text, generate semantic chunks, and store metadata.
    """
    # 1. Validate file extension
    original_filename = file.filename or "uploaded_file"
    ext = os.path.splitext(original_filename)[1].lower()

    if ext not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {allowed}",
        )

    # 2. Read content and validate file size
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded file: {str(e)}",
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty.",
        )

    if len(content) > settings.MAX_FILE_SIZE_BYTES:
        max_mb = settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {max_mb}MB.",
        )

    # 3. Save to disk and create initial record
    doc_record = await save_and_create_document(
        user_id=current_user.id,
        original_filename=original_filename,
        content=content,
        file_type=ext.replace(".", ""),
    )

    # 4. Extract text & generate chunks
    processed_doc = await process_document_content(
        doc_id=str(doc_record["_id"]),
        file_path=doc_record["file_path"],
        file_type=doc_record["file_type"],
    )

    return DocumentResponse(**format_doc_response(processed_doc))


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    current_user: UserResponse = Depends(get_current_user),
):
    """List all documents uploaded by the authenticated user."""
    docs = await get_user_documents(current_user.id)
    return DocumentListResponse(
        total=len(docs),
        documents=[DocumentResponse(**d) for d in docs],
    )


@router.get("/stats", response_model=DocumentStatsResponse)
async def document_stats(
    current_user: UserResponse = Depends(get_current_user),
):
    """Get aggregate document statistics for the current user."""
    stats = await get_document_stats(current_user.id)
    return DocumentStatsResponse(**stats)


@router.get("/{document_id}", response_model=DocumentDetailResponse)
async def get_document(
    document_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """Retrieve full details of a specific document, including text chunks."""
    doc = await get_document_by_id(document_id, current_user.id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )
    return DocumentDetailResponse(**doc)


@router.delete("/{document_id}")
async def remove_document(
    document_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """Delete a document record and its underlying physical file."""
    success = await delete_document(document_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or could not be deleted.",
        )
    return {
        "success": True,
        "message": "Document deleted successfully.",
        "id": document_id,
    }


@router.get("/{document_id}/download")
async def download_document(
    document_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """Download the original uploaded file."""
    doc = await get_document_by_id(document_id, current_user.id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )

    # Reconstruct file path
    file_path = os.path.join(
        settings.UPLOAD_DIR,
        str(current_user.id),
        doc["stored_filename"],
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physical file not found on server.",
        )

    return FileResponse(
        path=file_path,
        filename=doc["filename"],
        media_type="application/octet-stream",
    )


@router.post("/search", response_model=SemanticSearchResponse)
async def search_documents(
    search_req: SemanticSearchRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Phase 3: Semantic search across document chunks using vector embeddings and cosine similarity.
    """
    results = await semantic_search_chunks(
        user_id=current_user.id,
        query=search_req.query,
        document_id=search_req.document_id,
        top_k=search_req.top_k,
    )

    return SemanticSearchResponse(
        query=search_req.query,
        total_results=len(results),
        results=[SearchResultItem(**r) for r in results],
    )


@router.post("/{document_id}/reindex", response_model=DocumentResponse)
async def reindex_single_document(
    document_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Regenerates vector embeddings for all chunks of a specific document.
    """
    doc = await reindex_document(document_id, current_user.id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )
    return DocumentResponse(**doc)


@router.post("/compare", response_model=DocumentCompareResponse)
async def compare_documents_endpoint(
    req: DocumentCompareRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Compares two indexed documents and generates an academic comparative synthesis.
    """
    try:
        return await compare_documents(
            doc_id_a=req.document_id_a,
            doc_id_b=req.document_id_b,
            user_id=current_user.id,
            focus=req.focus or "comprehensive",
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Comparative synthesis failed: {e}",
        )

