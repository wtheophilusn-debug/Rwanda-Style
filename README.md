# Rwanda Style

Modern E-Commerce Marketplace — EWA408510 Final Project

## Live Links

- Frontend: (Vercel URL — add after deployment)
- Backend API: (Render URL — add after deployment)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| Images | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |
| DevOps | Docker, GitHub Actions |

## Project Structure

```
Rwanda-Style/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Project documentation
├── database/        # DB seed files
├── screenshots/     # Evidence screenshots
├── .github/
│   └── workflows/   # GitHub Actions CI/CD
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/rwanda-style.git
cd rwanda-style
```

### 2. Setup backend

```bash
cd server
npm install
cp ../.env.example .env
# Fill in your credentials in .env
npm run dev
```

### 3. Setup frontend

```bash
cd client
npm install
npm run dev
```

### 4. Run with Docker

```bash
docker compose up
```

## Environment Variables

Copy `.env.example` to `server/.env` and fill in all values. Never commit `.env` to GitHub.

## Author

Amb. Theophilus Nehemiah — Academic Year 2025–2026
