from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    conversation_id: int
    filename: str
    file_type: str
    file_size: int
    total_chars: int
    chunk_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
