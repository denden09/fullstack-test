import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <div style={styles.appContainer}>
        <BrowserRouter>
          <Navbar />

          <div style={styles.content}>
            <Routes>
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Posts />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  content: {
    maxWidth: "1000px",
    margin: "2rem auto",
    padding: "0 1rem",
    boxSizing: "border-box",
  },
};

export default App;
