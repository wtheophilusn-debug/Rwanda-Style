# Rwanda Style — Environment & Tools Checklist

**Verified on:** 2026-06-28  
**Machine:** Windows 10 (Build 26200.8655)  
**User:** BMW

---

## 1. Development Tools

| Tool | Status | Version / Location |
|---|---|---|
| Node.js LTS | ✅ Installed & Active | v22.23.1 (via nvm) |
| npm | ✅ Installed | v10.9.8 |
| nvm (Node Version Manager) | ✅ Installed | v1.2.2 — manages Node versions |
| Git | ✅ Installed | v2.54.0 — `C:\Program Files\Git` |
| VS Code | ✅ Installed | `C:\Users\BMW\AppData\Local\Programs\Microsoft VS Code` |
| Docker Desktop | ✅ Installed | Docker v29.5.3 / Compose v5.1.4 |
| MongoDB Compass | ✅ Installed | Confirmed working |
| Postman | ✅ Installed | Confirmed working |

---

## 2. nvm Notes

- nvm is installed at: `C:\Users\BMW\AppData\Local\nvm`
- Active Node version: `22.23.1` (LTS — recommended for this project)
- To check active version anytime: `nvm list`
- To switch version: `nvm use <version>`
- **Do not use v25.0.0** — it is listed in nvm but was never properly installed and is not LTS

---

## 3. Cloud Services & Accounts

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ Ready | Repository: `rwanda-style` |
| MongoDB Atlas | ✅ Configured | Cluster: `rwanda-style-cluster`, DB: `rwanda_style` |
| Cloudinary | ✅ Ready | Credentials stored separately in `server/.env` |
| Vercel | ✅ Account Ready | For React frontend deployment |
| Render | ✅ Account Ready | For Express backend deployment |

---

## 4. MongoDB Atlas Configuration

| Setting | Value |
|---|---|
| Organization | Amb.Theophilus Nehemiah's Org - 2026-06-28 |
| Project | Rwanda Style |
| Cluster | rwanda-style-cluster |
| Database | rwanda_style |
| DB User | wtheophilusn_db_user |
| Network Access | 0.0.0.0/0 (open for dev + cloud) |
| Connection string | Stored in `server/.env` as `MONGODB_URI` |

> ⚠️ Never commit `server/.env` to GitHub. Always keep it in `.gitignore`.

---

## 5. Environment Variables Reference

File: `server/.env` (never commit this file)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=<your-atlas-connection-string>
JWT_SECRET=<your-secret-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLIENT_URL=http://localhost:5173
```

---

## 6. Global npm Packages Already Present

Located in `C:\Users\BMW\AppData\Roaming\npm`:

| Package | Purpose |
|---|---|
| vercel | Vercel CLI — for frontend deployment |
| vite | Build tool — for React frontend |
| firebase | Firebase CLI (not used in this project) |
| mkcert | Local HTTPS certificates |

---

## 7. Quick Verification Commands

Run these anytime to confirm tools are working:

```bash
node --version        # Should show v22.x.x
npm --version         # Should show 10.x.x
git --version         # Should show 2.54.x
docker --version      # Should show 29.x.x
docker compose version  # Should show v5.x.x
nvm list              # Should show * 22.23.1
```

---

## 8. Project Workspace

| Item | Path |
|---|---|
| Project root | `C:\Users\BMW\Desktop\RwandaStyle` |
| Frontend (to be created) | `C:\Users\BMW\Desktop\RwandaStyle\client` |
| Backend (to be created) | `C:\Users\BMW\Desktop\RwandaStyle\server` |

---

## 9. Next Steps (In Order)

1. [ ] Initialize project folder structure
2. [ ] Create React frontend (`client/`) with Vite + Tailwind CSS
3. [ ] Create Express backend (`server/`) with MongoDB connection
4. [ ] Configure `server/.env` with real credentials
5. [ ] Connect Cloudinary for image uploads
6. [ ] Build all features (auth, products, cart, orders)
7. [ ] Set up Docker + docker-compose.yml
8. [ ] Configure GitHub Actions CI/CD
9. [ ] Deploy frontend to Vercel
10. [ ] Deploy backend to Render
11. [ ] Final testing + screenshots for submission
