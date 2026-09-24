# 🌟 Freelance Market Hub

A full-stack freelance marketplace built with **React (Vite)**, **Tailwind CSS**, **Node.js (Express)**, and connected to **MongoDB Atlas**.

---

## 🚀 Live Demo & Servers

| Component | URL | Port |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5174` (or `5173`) | 5174 |
| **Backend REST API** | `http://localhost:5001/api` | 5001 |
| **Database** | MongoDB Atlas Cluster (`Cluster0`) | Cloud |

---

## 🔑 Demo Login Credentials

You can use the **1-Click Demo Login** buttons on the Login page/Navbar, or enter the credentials manually:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Client** | `client@example.com` | `password123` | Post jobs, review proposals, accept/hire, release milestone payments, leave reviews |
| **Freelancer** | `freelancer@example.com` | `password123` | Browse jobs, submit proposals/bids, submit work deliverables, track earnings |

---

## 📦 Features Implemented

1. **User Authentication & Profiles**:
   - Secure JWT token authentication & bcrypt password hashing
   - Role-based workflows for **Clients** and **Freelancers**
   - Rich profiles with avatar, hourly rates, verified skills, and portfolio showcases
2. **Job Postings & Discovery**:
   - Real-time project search and filtering (by category, skills, budget range, experience level)
   - Dynamic sorting (newest, highest budget, most proposals)
3. **Proposals & Bidding System**:
   - Freelancers can bid on open projects with custom cover letters, estimated delivery times, and proposed milestones
   - Real-time proposal count and status tracking
4. **Milestone Contracts & Escrow Payments**:
   - Client can accept a proposal with 1-click to automatically generate an active contract
   - Freelancer deliverable submission module (live repository / demo link + documentation notes)
   - Client approval flow that releases escrow funds and updates platform metrics
5. **Rating & Reviews System**:
   - Interactive star rating and review comments for completed contracts
   - Automatic freelancer and client rating recalculation stored directly in MongoDB Atlas
6. **Direct Messaging & Notifications**:
   - Client-freelancer conversation threads with instant messaging
   - Notification badges for bids, contract updates, and payments

---

## 🛠️ How to Run Locally

### 1. Backend Setup:
```bash
cd backend
npm install
npm run seed     # (Optional) Seed realistic demo data into MongoDB Atlas
npm start        # Starts server on http://localhost:5001
```

### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5174
```
