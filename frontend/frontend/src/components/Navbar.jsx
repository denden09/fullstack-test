import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h3>MyBlog</h3>

      <div style={styles.links}>
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/create">Create Post</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #ddd",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  button: {
    background: "red",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
  },
};

export default Navbar;
