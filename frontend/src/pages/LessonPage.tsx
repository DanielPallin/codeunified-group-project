import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Lesson } from "../types/lesson";
import "./LessonPage.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const LessonPage = () => {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/courses/${courseSlug}/lessons/${lessonSlug}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const data = await response.json();
        setLesson(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch lesson");
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    fetchLesson();
    return () => clearTimeout(timer);
  }, [courseSlug, lessonSlug]);

  if (loading) {
    if (showLoader) {
      return (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      );
    }

    return null;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!lesson) {
    return <p>No lesson found.</p>;
  }

  return (
    <div className="lesson-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Lessons
      </button>

      <div className="lesson-content">
        <h1>{lesson.title}</h1>
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      {lesson.media_url && (
        <iframe
          className="lesson-video"
          src={lesson.media_url}
          title={lesson.title}
        />
      )}
    </div>
  );
};

export default LessonPage;
