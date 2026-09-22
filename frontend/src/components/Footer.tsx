import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">&lt;/&gt;</span>
            <span>CodeUnified</span>
          </Link>

          <p>
            Learn programming through courses, lessons and quizzes at your
            own pace.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h3>Learn</h3>
            <Link to="/courses">Courses</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div>
            <h3>Account</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CodeUnified. Group project.</p>
      </div>
    </footer>
  );
};

export default Footer;