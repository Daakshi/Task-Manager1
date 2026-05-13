# TaskFlow 🚀

> A full-stack **Collaborative Task Management System** built with React, Node.js, Express, and MongoDB.

![TaskFlow Banner](https://via.placeholder.com/1200x400/7c3aed/ffffff?text=TaskFlow+%E2%80%93+Collaborative+Task+Manager)

## ✨ Features

- 🔐 **JWT Authentication** – Secure signup/login with bcrypt-hashed passwords
- 📁 **Project Management** – Create projects, invite members by email
- ✅ **Task Management** – Create, edit, delete tasks with priorities and due dates
- 🗂️ **Kanban Board** – Visual 3-column board (Todo / In Progress / Done)
- 🖱️ **Drag and Drop** – HTML5 drag and drop for task status updates
- 👥 **Team Collaboration** – Add members and assign tasks
- 🌙 **Dark Mode** – Full dark/light theme toggle
- 📱 **Responsive Design** – Works on desktop, tablet, and mobile
- 🔔 **Toast Notifications** – Real-time feedback on all actions
- 🛡️ **Protected Routes** – Frontend and backend route protection

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Tailwind CSS v4 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Hook Form | Form validation |
| React Hot Toast | Notifications |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |

---

## 📁 Folder Structure

```
Task Management/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js              # Express entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── common/        # Modal, Spinner, ProtectedRoute
    │   │   ├── projects/      # CreateProjectModal, AddMemberModal
    │   │   └── tasks/         # TaskCard, CreateTaskModal, EditTaskModal
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── ProjectPage.jsx
    │   ├── services/
    │   │   ├── api.js         # Axios instance
    │   │   └── index.js       # Service functions
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Task Management"
```

### 2. Setup Backend
```bash
cd backend
npm install
# Configure your .env file
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📡 API Routes

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Projects
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/projects` | Get all user's projects | Private |
| GET | `/api/projects/:id` | Get single project | Private |
| POST | `/api/projects` | Create project | Private |
| POST | `/api/projects/:id/members` | Add member by email | Private (owner) |

### Tasks
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/tasks/me` | Get tasks assigned to current user | Private |
| GET | `/api/tasks/:projectId` | Get tasks for a project | Private |
| POST | `/api/tasks` | Create task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |

---

## 📖 API Documentation (Postman)

A complete Postman collection is included in the root directory: `TaskFlow-API.postman_collection.json`. 
You can import this directly into Postman to test all available endpoints. Don't forget to set your `{{token}}` variable after logging in!

---

## 🗄️ Database Models

### User
```json
{ "name": "string", "email": "string (unique)", "password": "hashed string" }
```

### Project
```json
{ "name": "string", "description": "string", "owner": "User ref", "members": ["User refs"] }
```

### Task
```json
{
  "title": "string",
  "description": "string",
  "priority": "Low | Medium | High",
  "status": "Todo | In Progress | Done",
  "dueDate": "Date",
  "assignedTo": "User ref",
  "project": "Project ref",
  "createdBy": "User ref"
}
```

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens expire in **7 days**
- All private API routes require `Authorization: Bearer <token>` header
- Passwords never returned in API responses (`select: false`)
- Environment variables for all secrets

---

## 🌐 Deployment

### Backend (Railway)
1. Deploy the repo to Railway via GitHub integration
2. Set Root Directory to `/backend`
3. Set environment variables in the dashboard:
   - `MONGO_URI` to your MongoDB Atlas connection string
   - `CLIENT_URL` to your deployed frontend URL
4. Generate a public domain under Settings > Networking

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` if not using proxy
2. Update `vite.config.js` proxy or Axios baseURL for production
3. Build: `npm run build`
4. Deploy the `dist/` folder

---

## 📄 License

MIT License © 2025 TaskFlow
