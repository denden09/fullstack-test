import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoverLogout, setHoverLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h3 style={styles.logo}>MyBlog</h3>

        <div style={styles.links}>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(hoveredLink === "home" && styles.linkHover),
            }}
            onMouseEnter={() => setHoveredLink("home")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/create"
                style={{
                  ...styles.link,
                  ...(hoveredLink === "create" && styles.linkHover),
                }}
                onMouseEnter={() => setHoveredLink("create")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Create Post
              </Link>

              <Link
                to="/profile"
                style={{
                  ...styles.link,
                  ...(hoveredLink === "profile" && styles.linkHover),
                }}
                onMouseEnter={() => setHoveredLink("profile")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  ...styles.button,
                  ...(hoverLogout && styles.buttonHover),
                }}
                onMouseEnter={() => setHoverLogout(true)}
                onMouseLeave={() => setHoverLogout(false)}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  ...styles.link,
                  ...(hoveredLink === "login" && styles.linkHover),
                }}
                onMouseEnter={() => setHoveredLink("login")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  ...styles.link,
                  ...(hoveredLink === "register" && styles.linkHover),
                }}
                onMouseEnter={() => setHoveredLink("register")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "rgba(51, 51, 51, 0.5)",
    backdropFilter: "blur(8px)",
    color: "white",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 1.2rem",
  },
  logo: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: "700",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.05rem",
    padding: "0.3rem 0.6rem",
    borderRadius: "6px",
    transition: "all 0.25s ease",
  },
  linkHover: {
    background: "rgba(255,255,255,0.15)",
    transform: "translateY(-2px)",
  },
  button: {
    background: "rgba(0, 123, 255, 0.85)",
    color: "white",
    border: "none",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
  },
  buttonHover: {
    background: "rgba(0, 123, 255, 1)",
    transform: "translateY(-2px)",
  },
};

export default Navbar;
