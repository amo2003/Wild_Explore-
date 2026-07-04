# 🌿 WildExplore

A full-stack wildlife database app with a React + Tailwind frontend and an Express + MongoDB backend.

---

## Project Structure

```
Wild Explore/
├── src/                  ← React frontend (Vite)
├── server/               ← Express + MongoDB backend
│   ├── index.js
│   ├── models/Animal.js
│   ├── routes/animals.js
│   ├── .env              ← NOT committed — copy from .env.example
│   └── .env.example
├── public/
├── .env                  ← Frontend env (VITE_API_URL)
├── .env.example
└── .env.production
```

---

## Local Development

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env — paste your MongoDB Atlas URI
npm install
npm run dev        # runs on http://localhost:5000
```

### 2. Frontend

```bash
# In the root Wild Explore/ folder
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000/api
npm install
npm run dev        # runs on http://localhost:5173
```

---

## Environment Variables

### `server/.env`
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default 5000) |
| `CLIENT_ORIGIN` | Frontend URL for CORS (e.g. https://yourapp.vercel.app) |

### `.env` (frontend)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. https://your-api.onrender.com/api) |

---

## Deployment

### Backend → Render / Railway

1. Push to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set **Root Directory** to `server`
4. **Build command**: `npm install`
5. **Start command**: `npm start`
6. Add environment variables: `MONGODB_URI`, `PORT=5000`, `CLIENT_ORIGIN=<your frontend URL>`

### Frontend → Vercel / Netlify

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `Wild Explore` (the frontend root)
3. Add environment variable: `VITE_API_URL=https://<your-backend>.onrender.com/api`
4. Deploy — Vite builds automatically

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/animals` | List all animals |
| GET | `/api/animals/:id` | Get one animal |
| POST | `/api/animals` | Create animal |
| PUT | `/api/animals/:id` | Update animal |
| DELETE | `/api/animals/:id` | Delete animal |
| GET | `/api/health` | Health check |
