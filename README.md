# Claude Chat

Claude API를 활용한 실시간 스트리밍 채팅 애플리케이션

## Tech Stack

**Frontend:** React 18 + TypeScript + Vite
**Backend:** Python + FastAPI
**Database:** SQLite + SQLAlchemy
**LLM:** Claude API (Anthropic)
**Auth:** JWT (bcrypt)

## Features

- Real-time streaming responses (SSE)
- User authentication (signup / login)
- Conversation management (create, list, delete)
- Markdown rendering with code syntax highlighting
- Dark / Light mode toggle
- Responsive design (mobile-friendly)

## Setup

### Prerequisites

- Python 3.12+ (Conda)
- Node.js 18+
- Anthropic API Key

### Backend

```bash
conda activate chatbot
cd backend
cp .env.example .env   # edit ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` (Swagger docs at `/docs`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (proxies `/api` to backend)

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry
│   │   ├── config.py         # Environment config
│   │   ├── database.py       # SQLAlchemy setup
│   │   ├── dependencies.py   # Auth dependencies
│   │   ├── models/           # ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   └── utils/            # JWT & password utils
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/              # HTTP & streaming clients
        ├── hooks/            # Custom React hooks
        ├── contexts/         # Auth & Theme providers
        ├── components/       # UI components
        ├── pages/            # Route pages
        └── types/            # TypeScript types
```
