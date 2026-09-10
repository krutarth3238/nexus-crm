<div align="center">

<img width="100%" alt="Nexus CRM Banner" src="https://raw.githubusercontent.com/krutarth3238/nexus-crm/main/banner.jpg" />

<br/>
<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

<h3>A production-grade, full-stack Customer Relationship Management platform built from scratch with a modern React frontend, a RESTful Node.js/Express API, Firebase authentication, and a real-time analytics dashboard.</h3>

</div>

---

## ✨ Features

### 🎫 Ticket Management System
- Create, view, update, and delete support tickets with full lifecycle tracking
- **Kanban board** view for drag-friendly status management (`Open → In Progress → Resolved → Closed`)
- **Table view** with sortable columns and inline status updates
- Rich **ticket detail modal** with activity history, priority, assignee, and tagging
- Advanced **filter & search bar** — filter by status, priority, assignee, and keyword simultaneously

### 📊 Analytics Dashboard
- Live analytics strip with key metrics: total tickets, open rate, resolution time, and SLA compliance
- Beautiful charts powered by **Recharts** with responsive layouts
- Data sourced from a dedicated analytics API — no client-side calculations

### 🔐 Authentication & Security
- **Firebase Authentication** with Google Sign-In — zero password management
- **Firebase Admin SDK** on the backend verifies every request server-side using ID tokens
- **JWT-based session management** for stateless, scalable API access
- **Rate limiting** middleware to protect against abuse
- Role-aware API middleware with centralized error handling

### 🎨 Polished UI/UX
- Fully responsive design — works seamlessly on mobile, tablet, and desktop
- **Dark / Light mode** toggle with persistent preference
- **GSAP** and **Motion** powered micro-animations and page transitions
- **Lenis** smooth scrolling for a premium feel
- Custom **Nexus logo** component and branded design system
- Cinematic **hero section** with animated landing page

---

## 🏗️ Architecture

```
nexus-crm/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── components/
│       │   ├── analytics/  # AnalyticsStrip
│       │   ├── common/     # Navbar, NexusLogo, ThemeToggle
│       │   ├── hero/       # HeroSection
│       │   └── tickets/    # Kanban, Table, Modals, Filters
│       ├── pages/          # LandingPage, LoginPage
│       ├── hooks/          # useTickets, useSmoothScroll
│       ├── context/        # Global state (auth, theme)
│       └── lib/            # Firebase client, API helpers
│
└── backend/                # Node.js + Express REST API
    └── src/
        ├── controllers/    # auth, tickets, analytics
        ├── routes/         # /auth, /tickets, /analytics
        ├── middleware/     # Firebase auth, rate limiter, error handler
        ├── db/             # SQLite schema, migrations, seed scripts
        ├── config/         # Firebase Admin SDK init
        └── utils/          # Shared helpers
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | GSAP, Motion (Framer), Lenis |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Auth (Client)** | Firebase Authentication (Google OAuth) |
| **Backend Runtime** | Node.js |
| **Backend Framework** | Express.js |
| **Database** | SQLite via `better-sqlite3` |
| **Auth (Server)** | Firebase Admin SDK + JWT |
| **Security** | `express-rate-limit`, `bcryptjs`, CORS |
| **Testing** | Jest + Supertest |
| **Hosting — Frontend** | Vercel |
| **Hosting — Backend** | Render |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Google Auth enabled
- A Firebase service account (for backend)

### 1. Clone the repo
```bash
git clone https://github.com/krutarth3238/nexus-crm.git
cd nexus-crm
```

### 2. Setup the Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your real values
npm run setup          # runs migrations + seed
npm run dev            # starts on http://localhost:4000
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in your real values
npm run dev                  # starts on http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 4000) |
| `NODE_ENV` | `development` or `production` |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `DB_PATH` | Path to SQLite file e.g. `./data/crm.db` |
| `CORS_ORIGIN` | Your frontend URL |
| `FIREBASE_PROJECT_ID` | From Firebase console |
| `FIREBASE_CLIENT_EMAIL` | From your service account JSON |
| `FIREBASE_PRIVATE_KEY` | From your service account JSON |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Your backend URL e.g. `http://localhost:4000/api/v1` |
| `VITE_FIREBASE_API_KEY` | Firebase web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Verify Firebase token, issue JWT | Firebase Token |
| `GET` | `/api/v1/tickets` | List all tickets (with filters) | JWT |
| `POST` | `/api/v1/tickets` | Create a new ticket | JWT |
| `GET` | `/api/v1/tickets/:id` | Get ticket details | JWT |
| `PATCH` | `/api/v1/tickets/:id` | Update ticket fields | JWT |
| `DELETE` | `/api/v1/tickets/:id` | Delete a ticket | JWT |
| `GET` | `/api/v1/analytics` | Get dashboard metrics | JWT |

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Uses **Jest** + **Supertest** to test API routes and controller logic.

---

## 📦 Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Auto-deploys on push to `main` |
| Backend | [Render](https://render.com) | Set `Root Directory` to `backend` |

Add all environment variables in each platform's dashboard. Neither Vercel nor Render reads your `.env` files from git.

---

## 📄 License

MIT © [Krutarth](https://github.com/krutarth3238)
