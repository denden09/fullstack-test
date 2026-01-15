# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


explanation:

Oke! Berikut contoh **README.md** yang bisa kamu pakai untuk proyek blog full-stack ini. Aku buat sederhana tapi lengkap, mencakup setup, struktur backend, API usage, dan beberapa asumsi/desain:

````markdown
# Full-Stack Blog Platform

A full-stack web application that simulates a blog platform where users can register, login, create, view, edit, and delete posts. Users can also comment on posts. Built with **React** on the frontend and **Node.js, Express, MongoDB** on the backend.

---

## Table of Contents
- [Project Setup](#project-setup)
- [Backend API Structure](#backend-api-structure)
- [Frontend Structure](#frontend-structure)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [Features](#features)

---

## Project Setup

### Backend
1. Navigate to the backend folder:
```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

4. Start the backend server:

```bash
npm start
```

The server will run on `http://localhost:5000`.

### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The app will open on `http://localhost:5173`.

---

## Backend API Structure

### Auth Routes

| Method | Endpoint       | Description            | Request Body                |
| ------ | -------------- | ---------------------- | --------------------------- |
| POST   | /auth/register | Register a new user    | `{ name, email, password }` |
| POST   | /auth/login    | Login a user           | `{ email, password }`       |
| POST   | /auth/logout   | Logout user (optional) | None                        |

### Post Routes

| Method | Endpoint   | Description       | Request Body                   | Auth Required |
| ------ | ---------- | ----------------- | ------------------------------ | ------------- |
| GET    | /posts     | Get all posts     | None                           | No            |
| GET    | /posts/:id | Get post by ID    | None                           | No            |
| POST   | /posts     | Create a new post | `{ title, content, category }` | Yes           |
| PUT    | /posts/:id | Update a post     | `{ title, content }`           | Yes (author)  |
| DELETE | /posts/:id | Delete a post     | None                           | Yes (author)  |

### Comment Routes

| Method | Endpoint            | Description                | Request Body  | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- | ------------- |
| GET    | /posts/:id/comments | Get all comments of a post | None          | No            |
| POST   | /posts/:id/comments | Add a comment              | `{ content }` | Yes           |
| PUT    | /comments/:id       | Update a comment           | `{ content }` | Yes (author)  |
| DELETE | /comments/:id       | Delete a comment           | None          | Yes (author)  |

---

## Frontend Structure

```
frontend/
├─ src/
│  ├─ api/
│  │  └─ axios.js            # Axios instance with baseURL and auth header
│  ├─ components/
│  │  └─ Navbar.jsx           # Top navigation bar
│  ├─ context/
│  │  └─ AuthContext.jsx      # Auth state and methods
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  ├─ Posts.jsx
│  │  ├─ PostDetail.jsx
│  │  ├─ CreatePost.jsx
│  │  ├─ EditPost.jsx
│  │  └─ Profile.jsx
│  └─ App.jsx                 # Main router and layout
```

* Navbar is responsive and updates links based on login state.
* AuthContext stores JWT in localStorage for authentication across sessions.
* Axios instance handles API calls with Authorization header when logged in.

---

## Assumptions & Design Decisions

1. Authorization: Only the post/comment author can edit or delete their content.
2. JWT Auth: Stored in localStorage, sent via `Authorization: Bearer <token>` for protected routes.
3. Responsive Design: Layout uses max-width containers and flexbox to adapt to mobile and desktop screens.
4. Simple UI: No external UI libraries; only inline styles and basic CSS for responsiveness.
5. Auto-login on Register: After successful registration, user is logged in automatically.
6. Error Handling: Alerts are used for simplicity. In production, a toast system would be better.
7. Backend Validation: Title, content, and email/password are validated. Passwords are hashed with bcrypt.

---

## Features

* User registration and login
* Create, view, edit, and delete posts
* Comment on posts (CRUD)
* Responsive design
* JWT-based authentication
* Navbar updates based on login status
* Profile page shows user's own posts

```



