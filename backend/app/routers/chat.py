import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse, ServerSentEvent

from app.dependencies import get_db
from app.schemas.message import MessageCreate
from app.services import claude_service, conversation_service, document_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/{conversation_id}")
async def send_message(
    conversation_id: int,
    body: MessageCreate,
    db: Session = Depends(get_db),
):
    conversation = conversation_service.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Save user message
    conversation_service.create_message(db, conversation_id, "user", body.message)

    # Build message history
    db_messages = conversation_service.get_messages(db, conversation_id)
    chat_messages = [{"role": m.role, "content": m.content} for m in db_messages]

    # Retrieve document context for RAG
    doc_context, doc_sources = document_service.retrieve_context(db, conversation_id, body.message)

    async def event_generator():
        full_response = ""
        try:
            async for token in claude_service.stream_response(chat_messages, system_context=doc_context):
                full_response += token
                yield ServerSentEvent(
                    data=json.dumps({"content": token}),
                    event="token",
                )

            # Save assistant message
            assistant_msg = conversation_service.create_message(
                db, conversation_id, "assistant", full_response
            )

            # Update conversation timestamp
            conversation_service.touch(db, conversation_id)

            # Auto-generate title from first user message via LLM
            new_title = None
            if conversation.title == "New Conversation" and len(db_messages) == 1:
                try:
                    new_title = await claude_service.generate_title(db_messages[0].content)
                    conversation_service.update_title(db, conversation_id, new_title)
                except Exception:
                    pass  # Title generation is non-critical

            done_payload: dict = {
                "message_id": assistant_msg.id,
                "conversation_id": conversation_id,
            }
            if new_title:
                done_payload["new_title"] = new_title
            if doc_sources:
                done_payload["sources"] = doc_sources

            yield ServerSentEvent(
                data=json.dumps(done_payload),
                event="done",
            )
        except Exception as e:
            yield ServerSentEvent(
                data=json.dumps({"detail": str(e)}),
                event="error",
            )

    return EventSourceResponse(event_generator())
