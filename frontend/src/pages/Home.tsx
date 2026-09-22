import { Link } from "react-router-dom";
import heroImage from "../assets/codeunified-hero.png";
import "./Home.css";

const Home = () => {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero-image">
          <img src={heroImage} alt="" />
        </div>

        <div className="home-hero-overlay" />

        <div className="home-hero-content">
          <span className="home-badge">Learn. Practice. Improve.</span>

          <h1>
            Turn your curiosity into <span>real skills.</span>
          </h1>

          <p>
            Learn programming through structured courses, practical lessons and
            quizzes. Choose the plan that fits your learning journey and
            progress at your own pace.
          </p>

          <div className="home-actions">
            <Link to="/register" className="home-button home-button-primary">
              Get started
            </Link>

            <Link to="/courses" className="home-button home-button-secondary">
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-section-heading">
          <span>How it works</span>

          <h2>Everything you need to keep learning</h2>

          <p>
            Follow courses, test your knowledge and keep track of your progress
            from your dashboard.
          </p>
        </div>

        <div className="home-feature-grid">
          <article className="home-feature-card">
            <div className="home-feature-top">
              <span className="home-feature-number">01</span>
              <span className="home-feature-icon">▱</span>
            </div>

            <h3>Learn</h3>

            <p>
              Follow structured programming courses and lessons designed to help
              you build your knowledge step by step.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-top">
              <span className="home-feature-number">02</span>
              <span className="home-feature-icon">&lt;/&gt;</span>
            </div>

            <h3>Practice</h3>

            <p>
              Test what you have learned with quizzes and build your knowledge
              as you progress through the platform.
            </p>
          </article>

          <article className="home-feature-card">
            <div className="home-feature-top">
              <span className="home-feature-number">03</span>
              <span className="home-feature-icon">▥</span>
            </div>

            <h3>Progress</h3>

            <p>
              Keep track of your learning from your dashboard and unlock more
              content with higher membership levels.
            </p>
          </article>
        </div>
      </section>

      <section className="home-membership">
        <div>
          <span>Choose your level</span>

          <h2>Start with the plan that works for you.</h2>

          <p>
            Compare the available membership levels and choose how much learning
            content you want access to.
          </p>
        </div>

        <Link to="/pricing" className="home-button home-button-primary">
          View plans
        </Link>
      </section>
    </main>
  );
};

export default Home;
