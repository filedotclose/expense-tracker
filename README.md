# Expense Tracker PWA

A premium, full-stack Progressive Web Application built for seamless offline-first expense management. Designed with a modern glassmorphism UI, interactive data visualizations, and robust background synchronization.

## 🚀 Key Features

*   **Offline-First Architecture**: Built using Workbox and IndexedDB. You can add, edit, and delete expenses even without an internet connection. The app will automatically sync with the backend once connectivity is restored.
*   **Premium Glassmorphism UI**: A beautifully crafted, responsive interface utilizing deep space dark mode (`#0f172a`), vivid accents, and hardware-accelerated animations.
*   **Interactive Analytics**: Dynamic dashboard featuring Recharts. Filter your spending by specific date ranges and categories to gain actionable financial insights.
*   **Secure Authentication**: JWT-based login and registration system with Bcrypt password hashing.
*   **PWA Ready**: Fully installable on both mobile and desktop via Chrome/Safari.

## 🛠 Tech Stack

### Frontend
*   **Framework**: React 19 + Vite
*   **Styling**: Vanilla CSS (Custom Design System)
*   **State Management**: React Context API
*   **Routing**: React Router DOM
*   **PWA & Offline**: Vite PWA Plugin, Workbox (Background Sync), IndexedDB (`idb`)
*   **Charts & Visuals**: Recharts, Lucide React icons
*   **Utils**: `date-fns`, `axios`

### Backend
*   **Framework**: Node.js + Express
*   **Database**: MongoDB (via Mongoose)
*   **Security**: Helmet, CORS, Express Validator, Zod
*   **Testing**: Jest, Supertest

## 📦 Project Structure

The project is structured as a monorepo containing both the frontend client and the Node.js backend API.

```
expense-tracker-pwa/
├── backend/                # Node.js + Express API
│   ├── config/             # DB Connection configuration
│   ├── controllers/        # Business logic for auth and expenses
│   ├── middleware/         # JWT Auth, Zod Validation, Error Handling
│   ├── models/             # Mongoose schemas (User, Expense)
│   ├── routes/             # Express API routes
│   └── tests/              # Jest test suites
├── frontend/               # React + Vite Client
│   ├── public/             # PWA Manifest icons
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── context/        # AuthContext and ExpenseContext (State & Offline Sync)
│   │   ├── pages/          # Dashboard, Expenses, Login, Register
│   │   ├── services/       # IndexedDB wrapper (db.js)
│   │   ├── sw.js           # Custom Workbox Service Worker
│   │   ├── App.jsx         # Routing & Protected Routes
│   │   └── index.css       # Core Design System
└── .planning/              # Antigravity architectural documents & task specs
```

## 💻 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB running locally on port `27017` (or an external Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure your MongoDB instance is running
npm run dev
```
*The backend server will start on `http://localhost:5000`.*

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React app will start on `http://localhost:5173`.*

## 🧪 Testing

The backend includes a comprehensive Jest test suite that uses an in-memory database configuration to avoid mutating production data.
```bash
cd backend
npm test
```

## 📱 PWA Installation

To install the app on your device:
1.  Run the production build: `npm run build` and preview it `npm run preview`.
2.  Open the app in Chrome or Safari.
3.  Click the "Install App" icon in the address bar (Desktop) or select "Add to Home Screen" from the share menu (Mobile).

---
*Built autonomously via the Antigravity Engineering Collective.*
