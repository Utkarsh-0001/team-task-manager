# Team Task Manager API

Base URL: `/api`

All protected routes accept `Authorization: Bearer <token>` and also support the HTTP-only `token` cookie returned by login/signup.

## Auth

### POST `/auth/signup`
Creates a user and returns `{ user, token }`.

```json
{
  "name": "Avery Admin",
  "email": "admin@teamtask.dev",
  "password": "Password123!",
  "role": "Admin",
  "title": "Delivery Lead"
}
```

### POST `/auth/login`
Returns `{ user, token }`.

```json
{
  "email": "admin@teamtask.dev",
  "password": "Password123!"
}
```

### POST `/auth/logout`
Clears the auth cookie.

### GET `/auth/me`
Returns the current authenticated user.

### GET `/auth/users`
Admin only. Returns team members.

## Projects

### GET `/projects`
Returns projects visible to the current user. Admins see all projects. Members see projects where they are team members.

### GET `/projects/:id`
Returns `{ project, tasks, activity }`.

### POST `/projects`
Admin only.

```json
{
  "name": "Atlas Mobile Refresh",
  "description": "Upgrade onboarding and collaboration workflows.",
  "deadline": "2026-07-01",
  "teamMembers": ["USER_ID"],
  "color": "#2563eb"
}
```

### PUT `/projects/:id`
Admin only. Accepts any project fields.

### DELETE `/projects/:id`
Admin only. Deletes the project, tasks, and related activity.

## Tasks

### GET `/tasks`
Query params: `status`, `priority`, `project`, `assignedTo`, `search`, `sort`, `page`, `limit`.

Example: `/tasks?status=Todo&priority=High&search=auth&sort=dueDate&page=1&limit=20`

### POST `/tasks`
Admin only.

```json
{
  "title": "Implement auth token refresh handling",
  "description": "Harden route guards and Axios interceptors.",
  "priority": "High",
  "status": "Todo",
  "dueDate": "2026-07-03",
  "assignedTo": "USER_ID",
  "project": "PROJECT_ID"
}
```

### PUT `/tasks/:id`
Admins can update any task field. Members can only update `status` on accessible assigned tasks.

### DELETE `/tasks/:id`
Admin only.

### POST `/tasks/:id/attachments`
Protected. Multipart form upload with field name `file`.

## Dashboard

### GET `/dashboard`
Returns project counts, task counts, overdue totals, chart data, recent activity, and member performance.

## Socket.io Events

Client emits:
- `join:user`
- `join:project`
- `chat:message`

Server emits:
- `task:created`
- `task:updated`
- `task:deleted`
- `task:attachment`
- `project:created`
- `project:updated`
- `project:deleted`
- `notification:new`
- `chat:message`

