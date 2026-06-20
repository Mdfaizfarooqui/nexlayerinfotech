# Nexlayer Fullstack Deployment Guide

To deploy this fullstack application online (Vercel for the frontend and Render for the backend) for free, follow the steps below.

---

## 1. Deploy the Backend to Render (Free Web Service)

Since Vercel is serverless and doesn't run persistent Node.js servers, you should host your Express backend on **Render**.

1. Log in to [Render](https://render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository (`nexlayerinfotech`).
3. Set the following configuration options:
   - **Name**: `nexlayer-backend` (or any custom name)
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Render will deploy the API and give you a public URL (e.g., `https://nexlayer-backend.onrender.com`).
   - *Note down this URL as you will need it for the frontend.*

### Important: SQLite on Render Free Tier
Because Render's free instances are ephemeral, any contact form submissions saved inside the local SQLite database (`void_studio.db`) will be reset every time the server spins down or restarts.
- **For production storage**, you should link a free PostgreSQL database (such as from [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)).
- Let me know if you would like me to add dynamic PostgreSQL database support to the backend.

---

## 2. Deploy the Frontend to Vercel (Free Static Site)

Host the React + Vite frontend on **Vercel** for fast edge delivery.

1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository (`nexlayerinfotech`).
3. In the project setup panel, click **Edit** next to **Root Directory** and select `frontend`.
4. Vercel will automatically detect **Vite** and configure the build/output commands.
5. Expand the **Environment Variables** section and add the following variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-backend-url.onrender.com` *(Replace with your actual Render backend service URL)*
6. Click **Deploy**.

---

## 3. Local Development vs. Production API URL

The frontend has been updated to support dynamic API urls:
- **Locally**: Falls back to querying `http://localhost:5000/api`.
- **In Production**: Automatically queries the custom `VITE_API_URL` environment variable you provided in Vercel.
