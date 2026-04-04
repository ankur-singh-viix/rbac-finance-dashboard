# Finance Dashboard — Backend API

A RESTful backend for a finance dashboard with role-based access control, financial records management, and analytics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB

### Setup
```bash
git clone <your-repo-url>
cd finance-dashboard/backend
npm install
cp .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecretkey123` |
| `NODE_ENV` | Environment | `development` |

---

## Roles & Permissions

| Action | Viewer | Analyst | Admin |
|---|---|---|---|
| View records | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Create records | ❌ | ✅ | ✅ |
| Update records | ❌ | ✅ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| View users | ❌ | ✅ | ✅ |
| Create/manage users | ❌ | ❌ | ✅ |

---

## API Reference

### Base URL