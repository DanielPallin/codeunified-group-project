import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {

  return (
    <header>
      <nav>
        <div>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;