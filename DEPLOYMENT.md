# 🚀 Deployment Guide - Freelance Market Hub

This document explains how to deploy the **Freelance Market Hub** Full-Stack application for production.

---

## 1. 🗄️ Database (MongoDB Atlas)
- Ensure your MongoDB Atlas cluster is active.
- In Network Access, allow access from anywhere (`0.0.0.0/0`) or whitelist your hosting provider's IP addresses.
- Copy your MongoDB Atlas connection string (`mongodb+srv://...`).

---

## 2. 🖥️ Backend Deployment (e.g., Render / Railway / Fly.io)

### Deploying on Render:
1. Create a **New Web Service** connected to your GitHub repository `https://github.com/kavyasrikarpurapu/FSD.git`.
2. Configure service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add **Environment Variables**:
   - `MONGODB_URI`: `<your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<strong secret string>`
   - `PORT`: `5001` (or leave default assigned by Render)
   - `NODE_ENV`: `production`
4. Deploy! Your backend API URL will be: `https://<your-backend-name>.onrender.com/api`.

---

## 3. 🌐 Frontend Deployment (e.g., Vercel / Netlify)

### Deploying on Vercel:
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add **Environment Variables**:
   - `VITE_API_URL`: `https://<your-backend-name>.onrender.com/api`
4. Deploy!
   - `vercel.json` and `_redirects` are pre-configured in the repository to guarantee full SPA client routing support without 404s on page refresh.

---

## 4. 🧪 Local Verification & Build Commands

```bash
# Frontend production build verification
cd frontend
npm run build

# Backend verification
cd backend
npm run dev
```
