from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.conversation import ConversationCreate, ConversationResponse, ConversationUpdate
from app.schemas.message import ConversationDetail
from app.services import conversation_service

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationResponse])
def list_conversations(db: Session = Depends(get_db)):
    return conversation_service.list_conversations(db)


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(body: ConversationCreate, db: Session = Depends(get_db)):
    return conversation_service.create_conversation(db, body.title)


@router.get("/{conversation_id}", response_model=ConversationDetail)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conversation = conversation_service.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.patch("/{conversation_id}", response_model=ConversationResponse)
def update_conversation(conversation_id: int, body: ConversationUpdate, db: Session = Depends(get_db)):
    conversation = conversation_service.update_title(db, conversation_id, body.title)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    if not conversation_service.delete_conversation(db, conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
