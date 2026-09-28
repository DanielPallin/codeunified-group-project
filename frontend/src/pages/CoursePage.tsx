import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Course } from "../types/course";
import type { Lesson } from "../types/lesson";
import "./CoursePage.css";
import LessonCard from "../components/LessonCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);

    const fetchCourseWithLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const [lessonsResponse, courseResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/courses/${slug}/lessons`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get(`http://localhost:3000/api/courses/${slug}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setLessons(lessonsResponse.data);
        setCourse(courseResponse.data);
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          setErrorStatus(error.response?.status ?? null);

          setError(error.response?.data?.message || "Failed to fetch course");
        } else {
          setError("Failed to fetch course");
        }
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    fetchCourseWithLessons();

    return () => clearTimeout(timer);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="course-page">
        {showLoader && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-page">
        <p>{error}</p>

        {errorStatus === 403 && <Link to="/pricing">Upgrade your plan</Link>}
      </div>
    );
  }

  if (!course) {
    return <p>No course found.</p>;
  }

  return (
    <div className="course-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Courses
      </button>
      <h1 className="course-page-title">{course.name}</h1>
      <p>{course.description}</p>

      <h2>Lessons</h2>

      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}

      <button
        className="quiz-button"
        onClick={() => navigate(`/courses/${course.slug}/quiz`)}
      >
        Take Quiz
      </button>
    </div>
  );
};

export default CoursePage;
