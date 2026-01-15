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
      <div style={styles.container}>
        <h3 style={styles.logo}>MyBlog</h3>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>

          {token ? (
            <>
              <Link to="/create" style={styles.link}>Create Post</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",      // tetap di atas
    top: 0,
    left: 0,
    width: "100%",
    background: "#333",
    color: "white",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",       // tengah secara horizontal
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
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
