# PulseNews Deployment Guide (Render & Vercel)

This guide walks you through deploying the **PulseNews** application to production using **Render** for the backend API and **Vercel** for the React frontend, connected to a cloud **MongoDB Atlas** cluster.

---

## Architecture Overview

```
┌─────────────────────────────────┐       HTTPS       ┌─────────────────────────────────┐
│     Client (Vercel)             │ ────────────────> │     Backend API (Render)        │
│     React + Vite SPA            │                   │     Express 4 + Node.js (ESM)   │
│     https://pulsenews.vercel.app│ <──────────────── │     https://pulsenews.onrender  │
└─────────────────────────────────┘   JSON Responses  └────────────────┬────────────────┘
                                                                       │ Mongoose
                                                                       ▼
                                                      ┌─────────────────────────────────┐
                                                      │     MongoDB Atlas (Cloud DB)    │
                                                      │     Users & Saved Articles      │
                                                      └─────────────────────────────────┘
```

---

## 1. Prerequisites

1. A **GitHub repository** with your code pushed.
2. A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database cluster.
3. A free [Render](https://render.com) account.
4. A free [Vercel](https://vercel.com) account.
5. An API key from [NewsAPI.org](https://newsapi.org) or [GNews.io](https://gnews.io).

---

## 2. Backend Deployment (Render Web Service)

### Step 2.1: Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `pulsenews-api` (or preferred name)
   - **Region**: Closest to your users (e.g., *Oregon*, *Frankfurt*, *Singapore*)
   - **Branch**: `master` (or `main`)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 2.2: Configure Backend Environment Variables
In the Render service settings, navigate to **Environment** and add the following keys:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations and trust-proxy settings |
| `PORT` | `10000` | *Auto-assigned by Render, server automatically uses `process.env.PORT`* |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/news_aggregator?retryWrites=true&w=majority` | Cloud MongoDB connection string |
| `JWT_SECRET` | `generate_a_random_64_character_string_here` | Secure secret used to sign and verify user JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `CLIENT_URL` | `https://your-client.vercel.app` | Allowed CORS origin (can be updated after frontend deployment) |
| `NEWS_API_KEY` | `your_actual_news_api_key` | External news provider API key |
| `NEWS_PROVIDER` | `newsapi` | News provider (*newsapi* or *gnews*) |

### Step 2.3: Verify Backend Deployment
Once deployed, open your Render URL in your browser:
- `https://your-service.onrender.com/api/health`

Expected response:
```json
{
  "status": "online",
  "service": "news-aggregator-api",
  "environment": "production",
  "database": {
    "status": "connected",
    "connected": true,
    "host": "cluster0-shard-00-00.mongodb.net",
    "name": "news_aggregator"
  },
  "uptime": 45,
  "timestamp": "2026-10-05T07:00:00.000Z"
}
```

---

## 3. Frontend Deployment (Vercel)

### Step 3.1: Import Project on Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `client`
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)

### Step 3.2: Configure Frontend Environment Variables
Expand the **Environment Variables** section on Vercel and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-service.onrender.com/api` | The public URL of your Render backend API |

> **Note**: `client/src/services/api.js` automatically strips trailing slashes and ensures `/api` is included, so either `https://your-service.onrender.com` or `https://your-service.onrender.com/api` works reliably.

### Step 3.3: Deploy & Verify
1. Click **Deploy**.
2. Vercel will build the React application using `client/vercel.json` (which ensures proper Single Page Application rewrite rules so refreshing pages will never produce 404 errors).
3. Once finished, copy your assigned Vercel domain (e.g., `https://pulsenews-taupe.vercel.app`).

---

## 4. Post-Deployment Checklist

1. **Update `CLIENT_URL` on Render**:
   - Go back to **Render Dashboard** → `pulsenews-api` → **Environment**.
   - Set `CLIENT_URL` to your production Vercel domain (e.g., `https://pulsenews-taupe.vercel.app`).
   - Render will automatically trigger a zero-downtime redeploy.
   - *Note*: Our backend CORS automatically accepts all `https://*.vercel.app` preview deployments as well!

2. **Test Authentication & Bookmarks End-to-End**:
   - Open your deployed Vercel site.
   - Click **Sign In** → **Create one now**.
   - Register a user and verify the toast alert appears.
   - Bookmark an article and check the **Saved Stories** tab.
   - Verify that logging out and refreshing the browser preserves clean state.

---

## 5. Local Development Commands

To run both services locally on your development machine:

```bash
# Terminal 1 - Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Port 5173)
cd client
npm run dev
```
