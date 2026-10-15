# NovaMind AI — Production Cloud Deployment Guide 🌐

This guide explains how to deploy **NovaMind AI** to the cloud for free with full functionality (Frontend + Backend + MongoDB Atlas + Gemini AI).

---

## Architecture Overview

```
                      ┌──────────────────────┐
                      │    Vercel / Netlify  │
                      │    (React 19 Frontend)│
                      └──────────┬───────────┘
                                 │ HTTPS API Calls
                                 ▼
                      ┌──────────────────────┐
                      │    Render / Railway  │
                      │    (FastAPI Backend) │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │  MongoDB Atlas   │            │  Google Gemini   │
       │  (Cloud Database)│            │  (LLM & Vectors) │
       └──────────────────┘            └──────────────────┘
```

---

## Step 1: MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a database user (e.g. `novamind_user` with a secure password).
4. Under **Network Access**, add IP Access: `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Drivers** (Python 3.12+) and copy your connection string:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/novamind_ai?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render.com

1. Go to [Render.com](https://render.com/) and link your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your repository: `Rafat772/NovaMind-AI`.
4. Configure the service:
   - **Root Directory**: `server`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `MONGODB_URL` | Your MongoDB Atlas connection string from Step 1 |
   | `DATABASE_NAME` | `novamind_ai` |
   | `JWT_SECRET` | Any long random secret key |
   | `GEMINI_API_KEY` | Your Gemini key (`AQ.Ab8RN...`) |
   | `GOOGLE_CLIENT_ID` | `401828421789-hu0h7rgq1n9it1thfa50euinfr5sff1g.apps.googleusercontent.com` |
6. Click **Deploy Web Service**.
7. Once deployed, copy your live backend URL (e.g., `https://novamind-ai-backend.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your repository: `Rafat772/NovaMind-AI`.
4. Set **Root Directory** to `client`.
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | Your Render Backend URL (e.g. `https://novamind-ai-backend.onrender.com`) |
   | `VITE_GOOGLE_CLIENT_ID` | `401828421789-hu0h7rgq1n9it1thfa50euinfr5sff1g.apps.googleusercontent.com` |
6. Click **Deploy**.
7. Your app is now live! (e.g., `https://novamind-ai.vercel.app`).

---

## Step 4: Add Production URLs to Google OAuth Console

1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, add:
   - Your Vercel frontend URL (e.g., `https://novamind-ai.vercel.app`)
4. Save changes. One-click Google Sign-In will now work in production!
