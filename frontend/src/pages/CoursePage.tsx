import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Course } from "../types/course";
import type { Lesson } from "../types/lesson";
import "./CoursePage.css";
import LessonCard from "../components/LessonCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/BackButton";
import QuizButton from "../components/QuizButton";

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

        const API_URL = import.meta.env.PROD
          ? "https://codeunified-group-project.onrender.com"
          : "http://localhost:3000";

        const [lessonsResponse, courseResponse] = await Promise.all([
          axios.get(`${API_URL}/api/courses/${slug}/lessons`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get(`${API_URL}/api/courses/${slug}`, {
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
        {errorStatus === 403 && (
          <>
            <p>You need to upgrade your subscription to access this course.</p>

            <Link to="/pricing">Upgrade your plan</Link>
          </>
        )}

        {errorStatus === 401 && (
          <>
            <p>Your session has expired. Please log in again.</p>

            <Link to="/login">Log in</Link>
          </>
        )}

        {errorStatus !== 401 && errorStatus !== 403 && <p>{error}</p>}
      </div>
    );
  }

  if (!course) {
    return <p>No course found.</p>;
  }

  return (
    <div className="course-page">
      <BackButton text="Back to Courses" />
      <h1 className="course-page-title">{course.name}</h1>
      <p>{course.description}</p>

      <h2>Lessons</h2>

      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
      <QuizButton course={course} />
    </div>
  );
};

export default CoursePage;
