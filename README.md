# Void Studio Full-Stack Portfolio

This project is a premium, full-stack migration of the Void Studio digital agency website, featuring a React frontend and an Express + SQLite backend.

## Project Structure
- `/frontend`: React + Vite client using Vanilla CSS for UI elements.
- `/backend`: Express API server communicating with a local SQLite database file (`void_studio.db`).

## Features
1. **Interactive Starfield & Follower Cursor**: Fully animated custom cursor and canvas-like star backdrop ported to React hooks.
2. **Portfolio Item Filter**: Allows the user to filter creative work by tags like SaaS, Branding, Mobile, and Web.
3. **Monthly/Annual Pricing Calculator**: An interactive toggle offering a 20% discount on annual subscriptions.
4. **Functional Contact Form**: Connected to the backend API via HTTP. Submissions are validated and stored.
5. **Secure Admin Dashboard**: Access via `/admin` view in the navigation, locked with a passcode. Displays analytics charts and submission lists where the admin can update inquiry status or delete records.

---

## Getting Started

### Prerequisites
- Node.js (version 18+ recommended)
- npm

### Installation
You can install dependencies for all workspaces at once:
```bash
npm run install-all
```

### Running the Application
To start both the React frontend and the Express backend concurrently in development mode:
```bash
npm run dev
```

The frontend will run at **http://localhost:5173** and the backend will listen on **http://localhost:5000**.

---

## Admin Panel Access
- Navigate to the **Admin** link in the header.
- Enter the admin passcode: `voidadmin`

---

## API Endpoints
- `POST /api/contacts` - Submit a contact request.
- `GET /api/contacts` - Fetch all inquiries.
- `PATCH /api/contacts/:id/status` - Modify inquiry status (`pending`, `in_progress`, `completed`).
- `DELETE /api/contacts/:id` - Delete an inquiry.
- `GET /api/stats` - Fetch overall counts and breakdown by category.
