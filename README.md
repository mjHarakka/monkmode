# ◎ monk mode

> Deep work. Tracked.

A minimal focus timer and session tracker built for developers. Dark mode, big timer, zero clutter.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-f59e0b?style=flat-square&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Features

- **Focus timer** — 25, 45, or 60 minute sessions with a live SVG ring
- **Task logging** — label what you're working on before each session
- **Reflections** — add a short note after each session completes
- **Streaks** — tracks daily consistency (current + longest streak)
- **Stats page** — total hours, weekly hours, 7-day bar chart
- **History** — all sessions grouped by date with completion bars
- **Google auth** — sign in with one click, data synced to Firestore

---

## Tech stack

| Layer     | Tech                        |
| --------- | --------------------------- |
| Framework | React 19 + TypeScript       |
| Styling   | Tailwind CSS v4             |
| Routing   | React Router v7             |
| Backend   | Firebase (Auth + Firestore) |
| Build     | Vite                        |
| Deploy    | Netlify                     |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/monkmode.git
cd monkmode
npm install
```

### 2. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google** sign-in under **Authentication → Sign-in method**
3. Create a **Firestore** database (production mode)
4. Add these Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Go to **Project Settings → Your apps → Web** and copy your config

### 3. Configure environment

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### 4. Run locally

```bash
npm run dev
```

---

## Deployment (Netlify)

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect your GitHub repo at [app.netlify.com](https://app.netlify.com) with:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Add your `VITE_FIREBASE_*` environment variables in **Site settings → Environment variables**.

Then add your Netlify domain to **Firebase Console → Authentication → Authorized domains**.

---

## Data model

```
Firestore
└── users/
    └── {uid}/
        └── sessions/
            └── {sessionId}
                ├── task: string
                ├── duration: number        # planned minutes
                ├── actualDuration: number  # seconds completed
                ├── reflection: string
                ├── completedAt: Timestamp
                └── date: string            # YYYY-MM-DD
```

---

## Project structure

```
src/
├── components/
│   ├── AuthPage.tsx          # Google sign-in screen
│   ├── Layout.tsx            # Nav + page shell
│   ├── FocusPage.tsx         # Timer page with streak badge
│   ├── Timer.tsx             # SVG ring timer
│   ├── ReflectionModal.tsx   # Post-session modal
│   ├── StatsPage.tsx         # Stats + bar chart
│   └── HistoryPage.tsx       # Session history
├── contexts/
│   └── AuthContext.tsx       # Firebase auth state
├── hooks/
│   └── useSessions.ts        # Firestore r/w + streak logic
├── lib/
│   └── firebase.ts           # Firebase init
└── types.ts                  # Shared TypeScript types
```
