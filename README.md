# TaskManagementSuite — MERN Stack Task & Project Management App

Taskmanagementsuite, Trello-style task and project management application built with **MongoDB, Express.js, React, and Node.js (MERN)**. It lets teams create boards, organize work into drag-and-drop lists, and track tasks on cards with labels, priorities, due dates, checklists, and comments.

![Stack](https://img.shields.io/badge/stack-MERN-6d28d9) ![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%3E%3D18-339933)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [Demo Credentials](#demo-credentials)
8. [Screenshots / Usage](#usage-flow)
9. [Roadmap](#roadmap)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- 🔐 **Authentication** — JWT-based register/login, password hashing with bcrypt
- 📋 **Boards** — Create, rename, color, archive, and delete boards
- 👥 **Collaboration** — Invite members to a board by email
- 🗂️ **Lists** — Add, rename, delete, and reorder lists (columns) on a board
- 🗃️ **Cards** — Create cards with title, description, priority, due date, color labels, checklists, and comments
- 🖱️ **Drag & Drop** — Move cards across lists and reorder lists with `@hello-pangea/dnd`
- ⚡ **Real-time ready** — Socket.IO wired up on the server for live board updates
- 🎨 **Responsive UI** — Clean, modern interface built with Tailwind CSS
- 🌱 **Seed script** — Populate the database with demo data instantly

## Tech Stack

| Layer      | Technology                                                             |
|------------|--------------------------------------------------------------------------|
| Frontend   | React 18, React Router v6, Tailwind CSS, Axios, @hello-pangea/dnd, Socket.IO Client, React Hot Toast, Vite |
| Backend    | Node.js, Express.js, Mongoose, JSON Web Token, bcryptjs, Socket.IO, Helmet, Morgan |
| Database   | MongoDB (local or MongoDB Atlas)                                        |
| Tooling    | ESLint, Nodemon, dotenv                                                 |

## Project Structure

```
taskflow/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers (auth, board, list, card)
│   ├── middleware/       # JWT auth guard, centralized error handler
│   ├── models/           # Mongoose schemas: User, Board, List, Card
│   ├── routes/           # Express routers
│   ├── utils/            # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js         # App entry point (Express + Socket.IO)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Navbar, List, Card, CardModal, ProtectedRoute
│   │   ├── context/       # AuthContext (global auth state)
│   │   ├── pages/         # Login, Register, Dashboard, BoardView
│   │   ├── services/      # Axios instance + API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm run dev
```

The API will start on `http://localhost:5000`.

Optional — seed the database with a demo board:

```bash
npm run seed
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will start on `http://localhost:5173` and proxy API calls to the backend.

### 4. Open the app

Visit `http://localhost:5173`, register a new account (or use the seeded demo account below), and start creating boards.

## Environment Variables

**backend/.env**

| Variable      | Description                              | Example                                   |
|---------------|-------------------------------------------|--------------------------------------------|
| `PORT`        | Port the API server listens on            | `5000`                                     |
| `NODE_ENV`    | Environment mode                          | `development`                              |
| `MONGO_URI`   | MongoDB connection string                 | `mongodb://127.0.0.1:27017/taskflow`       |
| `JWT_SECRET`  | Secret used to sign JWTs                  | any long random string                     |
| `JWT_EXPIRE`  | Token expiry                              | `7d`                                        |
| `CLIENT_URL`  | Frontend origin, used for CORS            | `http://localhost:5173`                    |

**frontend/.env**

| Variable          | Description             | Example                        |
|-------------------|--------------------------|----------------------------------|
| `VITE_API_URL`     | Base URL of the REST API | `http://localhost:5000/api`     |
| `VITE_SOCKET_URL`  | Socket.IO server URL     | `http://localhost:5000`         |

## API Reference

All protected routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint                          | Description                       | Access    |
|--------|------------------------------------|------------------------------------|-----------|
| POST   | `/api/auth/register`               | Register a new user                | Public    |
| POST   | `/api/auth/login`                  | Log in and receive a JWT           | Public    |
| GET    | `/api/auth/me`                     | Get current user profile           | Private   |
| GET    | `/api/boards`                      | List boards for current user       | Private   |
| POST   | `/api/boards`                      | Create a board                     | Private   |
| GET    | `/api/boards/:id`                  | Get a single board                 | Private   |
| PUT    | `/api/boards/:id`                  | Update a board                     | Private   |
| DELETE | `/api/boards/:id`                  | Delete a board                     | Private   |
| POST   | `/api/boards/:id/members`          | Add a member by email              | Private   |
| GET    | `/api/boards/:boardId/lists`       | Get all lists + cards for a board  | Private   |
| POST   | `/api/boards/:boardId/lists`       | Create a list                      | Private   |
| PUT    | `/api/boards/:boardId/lists/reorder` | Reorder lists                    | Private   |
| PUT    | `/api/lists/:id`                   | Rename / reposition a list         | Private   |
| DELETE | `/api/lists/:id`                   | Delete a list                      | Private   |
| POST   | `/api/lists/:listId/cards`         | Create a card                      | Private   |
| GET    | `/api/cards/:id`                   | Get card details                   | Private   |
| PUT    | `/api/cards/:id`                   | Update a card                      | Private   |
| PUT    | `/api/cards/:id/move`              | Move card to another list/position | Private   |
| POST   | `/api/cards/:id/comments`          | Add a comment to a card            | Private   |
| DELETE | `/api/cards/:id`                   | Delete a card                      | Private   |

## Demo Credentials

After running `npm run seed` in the backend:

```
Email:    admin@taskmanagementsuite.com
Password: shiv7810
```

## Usage Flow

1. Register or log in.
2. Create a board from the dashboard and pick a color.
3. Inside a board, add lists (e.g. "To Do", "In Progress", "Done").
4. Add cards to each list; click a card to set priority, due date, labels, and comments.
5. Drag and drop cards between lists to update their status in real time.

## Roadmap

- [ ] File attachments on cards
- [ ] Activity log / audit trail per board
- [ ] Email notifications for due dates
- [ ] Dark mode
- [ ] Unit and integration test suite (Jest + React Testing Library)

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and open a pull request describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).
