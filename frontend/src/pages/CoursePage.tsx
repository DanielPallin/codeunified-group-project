import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Course } from "../types/course";
import type { Lesson } from "../types/lesson";
import "./CoursePage.css";
import LessonCard from "../components/LessonCard";
import { useNavigate } from "react-router-dom";

const CoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

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
          setError("You must be logged in to access this course.");

          return;
        }

        const lessonsResponse = await fetch(
          `http://localhost:3000/api/courses/${slug}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const response = await fetch(
          `http://localhost:3000/api/courses/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!lessonsResponse.ok) {
          throw new Error("Failed to fetch lessons");
        }
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData);
        console.log("Fetched lessons:", lessonsData);

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch course");
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    fetchCourseWithLessons();

    return () => clearTimeout(timer);
  }, [slug]);

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
    return <p>{error}</p>;
  }

  if (!course) {
    return <p>No course found.</p>;
  }

  return (
    <div className="course-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Courses
      </button>
      <h1>{course.name}</h1>
      <p>{course.description}</p>

      <h2>Lessons</h2>

      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

export default CoursePage;
