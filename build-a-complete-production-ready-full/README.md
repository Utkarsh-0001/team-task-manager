# Team Task Manager

A full-stack MERN project management application for creating projects, managing team members, assigning tasks, and tracking delivery progress with Admin and Member roles.

The application is designed like a modern SaaS productivity tool, with a responsive dashboard, Kanban task board, analytics, authentication, protected APIs, and production deployment on Vercel, Render, and MongoDB Atlas.

## Live Links

- Frontend: [https://team-task-manager-seven-rho.vercel.app](https://team-task-manager-seven-rho.vercel.app)
- Backend API: [https://team-task-manager-34f2.onrender.com/api](https://team-task-manager-34f2.onrender.com/api)
- Backend Health Check: [https://team-task-manager-34f2.onrender.com/health](https://team-task-manager-34f2.onrender.com/health)

## Demo Credentials

```text
Admin
Email: admin@teamtask.dev
Password: Password123!

Member
Email: member@teamtask.dev
Password: Password123!
```

## Features

- Secure signup, login, logout, JWT authentication, and protected routes
- Password hashing with bcrypt
- Role-Based Access Control for Admin and Member users
- Admin project management: create, edit, delete projects, and manage teams
- Task management with title, description, priority, status, due date, assigned user, and project reference
- Drag-and-drop Kanban board for Todo, In Progress, and Completed tasks
- Task search, filtering, sorting, pagination-ready API, and overdue highlighting
- Dashboard with total projects, completed tasks, pending tasks, overdue tasks, charts, recent activity, and member performance
- Responsive modern UI with dark/light mode, glass-style cards, animations, loading states, and toast notifications
- Profile page
- Activity logs
- File attachment support
- Optional Socket.io real-time update support
- Email notification service configuration
- Production-ready CORS, rate limiting, validation, and error handling

## Tech Stack

**Frontend**

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API
- Framer Motion
- Recharts
- React Hot Toast
- @hello-pangea/dnd
- Socket.io Client

**Backend**

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Joi validation
- Helmet
- CORS
- express-rate-limit
- Nodemailer
- Socket.io
- Multer

**Deployment**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
team-task-manager/
  client/
    src/
      components/
      context/
      hooks/
      pages/
      services/
      utils/
    vercel.json

  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      services/
      utils/

  docs/
    API.md

  render.yaml
  README.md
```

## Screenshots

Add screenshots in this section after capturing the deployed application.

| Page | Preview |
| --- | --- |
| Landing Page | `screenshots/landing.png` |
| Login Page | `screenshots/login.png` |
| Dashboard | `screenshots/dashboard.png` |
| Projects | `screenshots/projects.png` |
| Kanban Board | `screenshots/kanban.png` |
| Tasks | `screenshots/tasks.png` |
| Profile | `screenshots/profile.png` |

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Utkarsh-0001/team-task-manager.git
cd team-task-manager
```

### 2. Install dependencies

```bash
npm run install:all
```

Or install separately:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure backend environment

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
ENABLE_SOCKET_IO=false
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Team Task Manager <no-reply@teamtaskmanager.app>"
```

### 4. Configure frontend environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_ENABLE_SOCKET_IO=false
```

### 5. Seed demo data

```bash
npm run seed
```

### 6. Start development servers

```bash
npm run dev
```

Frontend runs on the Vite dev URL. Backend runs on the configured `PORT`.

## Available Scripts

Root:

```bash
npm run install:all
npm run dev
npm run build
npm run seed
```

Server:

```bash
npm run dev
npm start
npm run seed
```

Client:

```bash
npm run dev
npm run build
npm run preview
```

## API Overview

Full API documentation is available in [docs/API.md](docs/API.md).

Main endpoints:

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
POST   /api/tasks/:id/attachments

GET    /api/dashboard
```

## Deployment

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add the required network access rule.
4. Copy the connection string.
5. Add it as `MONGO_URI` in Render.

### Backend Deployment on Render

Render can use the included `render.yaml`.

Manual Render settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Required Render environment variables:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://team-task-manager-seven-rho.vercel.app
FRONTEND_URL=https://team-task-manager-seven-rho.vercel.app
CORS_ORIGIN=https://team-task-manager-seven-rho.vercel.app
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
ENABLE_SOCKET_IO=false
```

### Frontend Deployment on Vercel

The frontend uses `client/vercel.json`.

Vercel settings:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
Framework: Vite
```

Required Vercel environment variables:

```env
VITE_API_URL=https://team-task-manager-34f2.onrender.com/api
VITE_SOCKET_URL=https://team-task-manager-34f2.onrender.com
VITE_ENABLE_SOCKET_IO=false
```

## Database Models

- User: name, email, password, role, avatar, title, projects
- Project: name, description, deadline, owner, team members, progress, color
- Task: title, description, priority, status, due date, assigned user, project, attachments
- Activity: actor, action, entity type, entity id, project
- Notification: recipient, title, message, type, read status, link

## Security

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only auth cookie support
- Bearer token support
- Role-based authorization middleware
- Joi request validation
- Helmet security headers
- CORS origin allowlist
- Rate limiting
- Mongo query sanitization
- Centralized error handling

## Author

Built by [Utkarsh](https://github.com/Utkarsh-0001).
