# My — AI 채팅 서비스

RAG(Retrieval-Augmented Generation) 기반 실시간 스트리밍 AI 채팅 애플리케이션

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | React 19 + TypeScript + Vite |
| **백엔드** | Python + FastAPI |
| **데이터베이스** | SQLite + SQLAlchemy |
| **LLM** | Groq API (llama-3.3-70b-versatile) |
| **인증** | JWT (bcrypt) |

## 주요 기능

- **RAG 문서 검색** — PDF/TXT 파일 업로드 후 문서 내용 기반 답변
- **실시간 스트리밍** — SSE(Server-Sent Events)로 토큰 단위 스트리밍
- **자동 대화 제목 생성** — 첫 메시지를 LLM으로 요약해 제목 자동 생성
- **대화 검색** — 사이드바에서 대화 제목 실시간 검색
- **타이핑 인디케이터** — 응답 대기 중 애니메이션 표시
- **마크다운 렌더링** — 코드 하이라이팅 포함
- **다크 / 라이트 모드** 토글
- **JWT 인증** — 회원가입 / 로그인

## 실행 방법

### 백엔드

```bash
conda activate chatbot
cd backend
cp .env.example .env   # GROQ_API_KEY 입력
pip install -r requirements.txt
uvicorn app.main:app --reload
```

`http://localhost:8000` 에서 실행 (Swagger: `/docs`)

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` 에서 실행 (`/api` 요청은 백엔드로 프록시)

## 프로젝트 구조

```
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI 진입점
│   │   ├── config.py         # 환경변수 설정
│   │   ├── database.py       # SQLAlchemy 설정
│   │   ├── dependencies.py   # 인증 의존성
│   │   ├── models/           # ORM 모델
│   │   ├── schemas/          # Pydantic 스키마
│   │   ├── routers/          # API 엔드포인트
│   │   ├── services/         # 비즈니스 로직
│   │   └── utils/            # JWT & 패스워드 유틸
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── api/              # HTTP & 스트리밍 클라이언트
        ├── hooks/            # 커스텀 React 훅
        ├── contexts/         # Auth & Theme 프로바이더
        ├── components/       # UI 컴포넌트
        ├── pages/            # 라우트 페이지
        └── types/            # TypeScript 타입
```
