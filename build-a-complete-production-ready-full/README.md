# Team Task Manager

A production-ready full-stack task and project workspace inspired by Jira, Trello, and Asana. It includes JWT authentication, Admin/Member role-based permissions, project and task management, drag-and-drop Kanban, analytics, real-time updates, notifications, attachments, seed data, and deployment configuration.

## Features

- Signup, login, logout, JWT auth, protected routes, password hashing with bcrypt.
- Admin and Member roles with route-level and API-level permissions.
- Project CRUD with deadline, description, progress, owner, and team members.
- Task CRUD with priority, status, due date, assignee, project reference, filtering, search, sorting, pagination, overdue highlighting, and Kanban drag-and-drop.
- Dashboard with total projects, completed tasks, pending tasks, overdue tasks, Recharts task chart, recent activity, and member performance.
- Dark/light mode, responsive SaaS UI, glass-style surfaces, Framer Motion animations, loading skeletons, and toast notifications.
- Socket.io real-time task/project/notification events.
- Email notification service via SMTP settings.
- File attachments via multipart upload.
- MongoDB models for User, Project, Task, Activity, and Notification.
- Render backend config and Vercel frontend config.

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API, Framer Motion, Recharts, Socket.io Client, react-hot-toast, @hello-pangea/dnd.

Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Joi, Socket.io, Nodemailer, Helmet, CORS, rate limiting, mongo sanitization.

## Project Structure

```text
client/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    utils/
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
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Set `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://team-task-manager-seven-rho.vercel.app
FRONTEND_URL=https://team-task-manager-seven-rho.vercel.app
CORS_ORIGIN=https://team-task-manager-seven-rho.vercel.app
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
ENABLE_SOCKET_IO=false
COOKIE_SECURE=false
```

4. Set `client/.env`:

```env
VITE_API_URL=https://team-task-manager-34f2.onrender.com/api
VITE_SOCKET_URL=https://team-task-manager-34f2.onrender.com
VITE_ENABLE_SOCKET_IO=false
```

5. Seed demo data:

```bash
npm run seed
```

6. Start both apps:

```bash
npm run dev
```

Frontend dev URL is printed by Vite after startup.  
Backend health endpoint is `/health` on the configured API host.

## Demo Credentials

Admin:

```text
admin@teamtask.dev
Password123!
```

Member:

```text
member@teamtask.dev
Password123!
```

## API Documentation

See [docs/API.md](docs/API.md).

## Deployment

### MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user.
3. Allow Render outbound access. For quick demos, Atlas can allow broad network access; for production, restrict network access where possible.
4. Copy the connection string into `MONGO_URI`.

### Backend on Render

1. Create a Render web service from this repository.
2. Set the service root directory to `server`.
3. Add environment variables from `server/.env.example`.
4. Set `NODE_ENV=production`.
5. Set `CLIENT_URL`, `FRONTEND_URL`, and `CORS_ORIGIN` to `https://team-task-manager-seven-rho.vercel.app`.
6. Deploy. Render can use the root `render.yaml`, or use build command `npm install` and start command `npm start` with root directory `server`.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set the root directory to `client`.
3. Add:

```env
VITE_API_URL=https://team-task-manager-34f2.onrender.com/api
VITE_SOCKET_URL=https://team-task-manager-34f2.onrender.com
VITE_ENABLE_SOCKET_IO=false
```

4. Deploy. Vercel will use `client/vercel.json`.

## Screenshots

Add production screenshots after deployment:

- Landing page
- Dashboard analytics
- Project Kanban board
- Mobile navigation

## Security Notes

- Passwords are hashed using bcrypt.
- JWTs are accepted via bearer token and HTTP-only cookie.
- Protected APIs use auth middleware.
- Admin-only actions use RBAC middleware.
- Joi validates request bodies.
- Helmet, CORS, HPP, mongo sanitization, request size limits, and rate limiting are enabled.
- Use strong `JWT_SECRET` and SMTP credentials in production.
