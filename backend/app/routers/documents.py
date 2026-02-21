from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.document import DocumentResponse
from app.services import conversation_service, document_service

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_TYPES = {"application/pdf": "pdf", "text/plain": "txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post(
    "/{conversation_id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    conversation_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    conversation = conversation_service.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Validate file type
    content_type = file.content_type or ""
    file_type = ALLOWED_TYPES.get(content_type)
    if not file_type:
        filename = file.filename or ""
        if filename.lower().endswith(".pdf"):
            file_type = "pdf"
        elif filename.lower().endswith(".txt"):
            file_type = "txt"
        else:
            raise HTTPException(
                status_code=400, detail="Only PDF and TXT files are supported"
            )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty")

    document = document_service.upload_document(
        db=db,
        conversation_id=conversation_id,
        filename=file.filename or "untitled",
        file_type=file_type,
        file_size=len(file_bytes),
        file_bytes=file_bytes,
    )
    return document


@router.get("/{conversation_id}", response_model=list[DocumentResponse])
def list_documents(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    conversation = conversation_service.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return document_service.list_documents(db, conversation_id)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    if not document_service.delete_document(db, document_id):
        raise HTTPException(status_code=404, detail="Document not found")
