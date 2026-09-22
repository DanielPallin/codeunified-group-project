import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="site-logo" onClick={closeMenu}>
          <span className="site-logo-mark">&lt;/&gt;</span>
          <span>CodeUnified</span>
        </Link>

        <button
          type="button"
          className="site-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`site-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <div className="site-nav-links">
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/courses" onClick={closeMenu}>
              Courses
            </Link>
            <Link to="/quiz" onClick={closeMenu}>
              Quiz
            </Link>
            <Link to="/pricing" onClick={closeMenu}>
              Pricing
            </Link>
            <Link to="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
          </div>

          <div className="site-nav-account">
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="site-register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
