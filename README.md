# 💰 Finance Dashboard — Backend API

A RESTful backend system for managing financial records with role-based access control (RBAC), authentication, and analytics.

> Backend-focused project. A basic React UI is included only for demonstration.

---

## ⚙️ Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken + bcryptjs)
-  Postman (API Docs)
- React (basic frontend)

---

## 🚀 Setup

```bash
git clone <your-repo-link>
cd finance-dashboard/backend
npm install
cp  .env
.env
PORT=5000
MONGO_URI=mongodb+srv://ankur:ankur12345@cluster0.sgsnehx.mongodb.net/?appName=Cluster0
JWT_SECRET=supersecretkey123
NODE_ENV=development

Run
npm run dev

👉 Server: http://localhost:5000

👤 Default Admin
Email: admin@test.com
Password: admin123
🔐 Roles

viewer < analyst < admin

Action	Viewer	Analyst	Admin
View data	✅	✅	✅
Create/update	❌	✅	✅
Delete	❌	❌	✅
Manage users	❌	❌	✅
🌐 API Base URL
http://localhost:5000/api
🔑 Auth Header
Authorization: Bearer <token>
📌 Main Endpoints
Auth
POST /auth/login
POST /auth/register
GET /auth/me
Users (Admin/Analyst)
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
Records
GET /records
POST /records
PATCH /records/:id
DELETE /records/:id
Dashboard
GET /dashboard/summary
GET /dashboard/categories
GET /dashboard/trends/monthly
📊 API Docs
Postman Collection

http://localhost:5000/api/docs

Postman Collection

https://www.postman.com/ankurkumar-3176089/workspace/finance-dashboard-public/collection/44026817-132ab28a-ba36-4e2b-b768-e3d48148255a?action=share&creator=44026817

🧪 Testing Flow
Run backend
Login → get token
Use token for all APIs
🖥️ Frontend

Basic React UI included (Login + Protected Route)

👨‍💻 Author

Ankur Singh


---
