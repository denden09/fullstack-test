### 🔐 Authentication
- User registration & login (JWT-based)
- Protected routes using middleware
- Get user profile (`/users/me`)

### 📝 Posts
- Create new blog posts (authenticated users only)
- View all posts
- Search posts by title or content
- View post details
- Author information on posts

### 👤 User
- User profile with name, email, and avatar
- Profile image support (uploads)

### 🎨 Frontend
- Built with **React**
- React Router for navigation
- Axios for API calls
- Markdown support for post content
- Responsive card-based UI

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- bcryptjs (password hashing)

### Frontend
- React
- React Router DOM
- Axios
- React Markdown + Remark GFM

---

## 📂 Project Structure

```

backend/
│── models/
│   ├── User.js
│   └── Post.js
│── routes/
│   ├── auth.js
│   ├── user.js
│   ├── post.js
│   └── comment.js
│── middleware/
│   └── authMiddleware.js
│── uploads/
│── server.js
│── .env

frontend/
│── src/
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Posts.jsx
│   │   ├── CreatePost.jsx
│   │   └── Login.jsx
│   └── App.jsx

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mern-blog.git
cd mern-blog
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

Backend API:

```
http://localhost:5000
```

---

## 🔗 API Endpoints

### Auth

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |

### User

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | `/users/me` | Get current user profile |

### Posts

| Method | Endpoint     | Description                      |
| ------ | ------------ | -------------------------------- |
| GET    | `/posts`     | Get all posts (search supported) |
| POST   | `/posts`     | Create new post (auth required)  |
| GET    | `/posts/:id` | Get post by ID                   |

---

## 🔐 Authorization

Protected routes require JWT token in headers:

```http
Authorization: Bearer <your_token_here>
```

---

## 🧪 Testing with Postman

1. Login → copy token
2. Set token in Authorization tab (Bearer Token)
3. Test protected endpoints like:

   * `/users/me`
   * `POST /posts`

---

## 🧠 Known Issues & Fixes

* `posts.map is not a function`
  ✔ Fixed by validating API response as array

* New post not showing
  ✔ Fixed by refetching posts on component mount

---

## 📌 Future Improvements

* Pagination for posts
* Like & comment system
* User profile editing
* Image upload for posts
* Deployment (Vercel + Render)

---

## 👨‍💻 Author

**Vinsensius Arden**
Backend & Fullstack Developer
Interested in Software Engineering & Machine Learning


