import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={styles.appContainer}>
          <Navbar />

          {/* GLOBAL PAGE WRAPPER */}
          <main style={styles.pageWrapper}>
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Poppins', sans-serif", // 👈 bisa ganti font
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },

  pageWrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "100px 1rem 2rem", // 👈 aman dari navbar fixed
    boxSizing: "border-box",

    display: "flex",
    flexDirection: "column",
    // ❌ alignItems: "center" (DIHAPUS)
  },
};

export default App;
