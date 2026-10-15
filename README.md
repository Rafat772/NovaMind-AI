# NovaMind AI 🧠🚀
### Next-Generation AI-Powered Research & Knowledge Platform

NovaMind AI is an enterprise-grade AI research workspace built with **FastAPI**, **MongoDB**, **React 19**, and **Tailwind CSS**, powered by **Google Gemini AI**. It combines sliding-window semantic chunking, dense vector retrieval, and retrieval-augmented generation (RAG) to help researchers synthesize papers, query documents, inspect source citations, and generate executive summaries.

---

## 🌟 Key Features Across All 5 Phases

### 🔐 Phase 1: Enterprise Authentication & Google OAuth 2.0
- **JWT & Bcrypt**: Secure email/password registration and login with salted hashing.
- **Google Sign-In**: One-click Google Identity Services (GIS) integration with backend cryptographic token verification (`google-auth`).
- **Protected Routing**: Global React AuthContext, persistent session tokens, and route guards.

### 📚 Phase 2: Document Ingestion & Knowledge Management
- **Multi-Format Extraction**: Ingestion engine for PDF (`pypdf`), Word DOCX (`python-docx`), plain text (`.txt`), and Markdown (`.md`).
- **Semantic Sliding-Window Chunking**: Splits literature into digestible segments with page tracking, overlap windows, and token boundaries.
- **Inspector UI**: Drag-and-drop file upload with progress bar, document status badges, metadata explorer, and chunk inspection modal.

### ⚡ Phase 3: Semantic Vector Embeddings & Similarity Engine
- **Dense 3072-dim Embeddings**: Powered by Google Gemini's `gemini-embedding-001` and normalized fallback vectorizers.
- **Cosine Similarity Ranking**: Real-time ranking with match percentage badges and defensive dimensional alignment.
- **Document Reindexing**: On-demand and automatic backfilling of embeddings across stored literature.

### 💬 Phase 4: Grounded AI Research Assistant & Multi-Session Chat
- **RAG Research Pipeline**: Conversational assistant grounded directly in your uploaded knowledge base.
- **Direct Source Citations**: Inline citations with verified file references, page numbers, and similarity scores.
- **Multi-Session History**: Create, switch, rename, and delete concurrent research threads stored in MongoDB.
- **Scope Filtering**: Filter research chat across your whole library or focus specifically on an individual document.

### 📊 Phase 5: Research Analytics & Executive Synthesis Reports
- **Productivity Dashboard**: Real-time metrics for total indexed documents, extracted passages, chat queries, and system storage.
- **Activity Visualizations**: Interactive weekly query cadence bar charts and file type distribution breakdowns.
- **Executive Synthesis Generator**: On-demand executive research reports generated with Google Gemini LLMs with instant Markdown export.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Glassmorphic Dark Design System
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Interceptors & Error Handlers

### Backend
- **Framework**: FastAPI (Async Python 3.13)
- **Database**: MongoDB with Motor (Async driver)
- **AI / LLM**: Google GenAI SDK (`gemini-flash-lite-latest`, `gemini-3.8-flash`, `gemini-embedding-001`)
- **Document Extractors**: `pypdf`, `python-docx`
- **Security**: Python-Jose (JWT) & Passlib (Bcrypt) & Google Auth
- **Server**: Uvicorn ASGI

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://python.org/) (v3.10+)
- [MongoDB](https://www.mongodb.com/) (Local instance on `localhost:27017` or MongoDB Atlas)
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Backend Setup (`/server`)

```bash
cd server

# Activate Python virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
cp .env.example .env
# Set your MONGODB_URL, JWT_SECRET, and GEMINI_API_KEY in server/.env

# Run FastAPI backend
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 3. Frontend Setup (`/client`)

```bash
cd client

# Install packages
npm install

# Configure environment variables (.env)
# VITE_API_BASE_URL=http://localhost:8000
# VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Start Vite dev server
npm run dev
```
- **Frontend App**: `http://localhost:5173`

---

## 📁 Repository Structure

```text
NovaMind-AI/
├── client/                     # Frontend React 19 + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # LoginForm, GoogleAuthButton, ProtectedRoute
│   │   │   ├── common/         # Button, Card, Input, Loader, Logo
│   │   │   ├── dashboard/      # ChatWindow, ChatMessage, ChatInput, Sidebar, Topbar
│   │   │   ├── documents/      # UploadCard, DocumentList, DocumentCard, DocumentDetailModal, SemanticSearchCard
│   │   │   ├── reports/        # ReportsOverview, ActivityChart, RecentActivity, ReportModal
│   │   │   └── settings/       # ProfileCard, AccountSettings
│   │   ├── context/            # AuthContext (JWT & Google Auth state)
│   │   ├── layouts/            # DashboardLayout & AuthLayout
│   │   ├── pages/              # Dashboard, Documents, Reports, Login
│   │   ├── routes/             # AppRoutes (Public & Protected routes)
│   │   ├── services/           # Axios services: api, authService, documentService, chatService, reportService
│   │   └── index.css           # Glassmorphic Tailwind theme & custom utilities
│   └── package.json
│
├── server/                     # Backend FastAPI application
│   ├── app/
│   │   ├── core/               # config.py, database.py, dependencies.py
│   │   ├── routers/            # auth.py, documents.py, chat.py, reports.py
│   │   ├── schemas/            # Pydantic schemas (user, document, chat, report, token)
│   │   └── services/           # auth_service, document_service, embedding_service, chat_service, report_service
│   ├── requirements.txt        # Backend dependencies
│   └── .env.example            # Environment variables template
│
└── README.md                   # Full platform architecture & setup documentation
```

---

## 🔒 Security & Privacy
- API keys and tokens are secured via environment variables and excluded by `.gitignore`.
- Password hashes are stored using industry-standard Bcrypt with salt.
- JWT tokens expire automatically and are verified on all restricted REST endpoints.
- Uploaded files are safely mapped to individual user IDs ensuring strict multi-tenant privacy.
