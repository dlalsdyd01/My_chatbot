import re
from io import BytesIO

from sqlalchemy.orm import Session

from app.models.document import Document, DocumentChunk


# ── Text Extraction ──


def extract_text_from_pdf(file_bytes: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(BytesIO(file_bytes))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text)
    return "\n\n".join(pages)


def extract_text_from_txt(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return file_bytes.decode("latin-1")


def extract_text(file_bytes: bytes, file_type: str) -> str:
    if file_type == "pdf":
        return extract_text_from_pdf(file_bytes)
    return extract_text_from_txt(file_bytes)


# ── Chunking ──

CHUNK_SIZE = 1500
CHUNK_OVERLAP = 200


def chunk_text(
    text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP
) -> list[str]:
    if len(text) <= chunk_size:
        return [text]

    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 1 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = current_chunk[-overlap:] + " " + sentence
        else:
            current_chunk = (current_chunk + " " + sentence) if current_chunk else sentence

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


# ── CRUD ──


def upload_document(
    db: Session,
    conversation_id: int,
    filename: str,
    file_type: str,
    file_size: int,
    file_bytes: bytes,
) -> Document:
    text = extract_text(file_bytes, file_type)
    chunks = chunk_text(text)

    document = Document(
        conversation_id=conversation_id,
        filename=filename,
        file_type=file_type,
        file_size=file_size,
        total_chars=len(text),
        chunk_count=len(chunks),
    )
    db.add(document)
    db.flush()

    for i, chunk_content in enumerate(chunks):
        chunk = DocumentChunk(
            document_id=document.id,
            chunk_index=i,
            content=chunk_content,
            char_count=len(chunk_content),
        )
        db.add(chunk)

    db.commit()
    db.refresh(document)
    return document


def list_documents(db: Session, conversation_id: int) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.conversation_id == conversation_id)
        .order_by(Document.created_at)
        .all()
    )


def delete_document(db: Session, document_id: int) -> bool:
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return False
    db.delete(doc)
    db.commit()
    return True


# ── Retrieval ──

MAX_CONTEXT_CHARS = 6000


def _tokenize(text: str) -> set[str]:
    return set(re.findall(r"\w{3,}", text.lower()))


def _score_chunk(query_tokens: set[str], chunk_content: str) -> float:
    chunk_tokens = _tokenize(chunk_content)
    if not query_tokens:
        return 0.0
    overlap = query_tokens & chunk_tokens
    return len(overlap) / len(query_tokens)


def retrieve_context(
    db: Session, conversation_id: int, query: str
) -> tuple[str, list[dict]]:
    documents = list_documents(db, conversation_id)
    if not documents:
        return "", []

    total_chars = sum(doc.total_chars for doc in documents)

    all_chunks = []
    for doc in documents:
        for chunk in doc.chunks:
            all_chunks.append(
                {
                    "content": chunk.content,
                    "char_count": chunk.char_count,
                    "filename": doc.filename,
                    "chunk_index": chunk.chunk_index,
                }
            )

    if not all_chunks:
        return "", []

    # Small documents: include everything, one source entry per document
    if total_chars <= MAX_CONTEXT_CHARS:
        parts = []
        sources = []
        for doc in documents:
            doc_text = "\n".join(c.content for c in doc.chunks)
            parts.append(f"[Document: {doc.filename}]\n{doc_text}")
            sources.append(
                {
                    "filename": doc.filename,
                    "chunk_index": 0,
                    "preview": doc_text[:150],
                }
            )
        return "\n\n---\n\n".join(parts), sources

    # Large documents: rank chunks by relevance
    query_tokens = _tokenize(query)
    scored = []
    for chunk in all_chunks:
        score = _score_chunk(query_tokens, chunk["content"])
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)

    selected = []
    sources = []
    budget = MAX_CONTEXT_CHARS
    for score, chunk in scored:
        if chunk["char_count"] <= budget:
            selected.append(f"[From: {chunk['filename']}]\n{chunk['content']}")
            sources.append(
                {
                    "filename": chunk["filename"],
                    "chunk_index": chunk["chunk_index"],
                    "preview": chunk["content"][:150],
                }
            )
            budget -= chunk["char_count"]
        if budget <= 0:
            break

    return "\n\n---\n\n".join(selected), sources
