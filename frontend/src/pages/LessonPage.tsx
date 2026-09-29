import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Lesson } from "../types/lesson";
import "./LessonPage.css";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import BackButton from "../components/BackButton";

const LessonPage = () => {
  const { courseSlug, lessonSlug } = useParams();
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

        const API_URL = import.meta.env.PROD 
            ? 'https://codeunified-group-project.onrender.com' 
            : 'http://localhost:3000';

        const response = await axios.get(
          `${API_URL}/api/courses/${courseSlug}/lessons/${lessonSlug}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setLesson(response.data);
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch lesson");
        } else {
          setError("Failed to fetch lesson");
        }
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    fetchLesson();
    return () => clearTimeout(timer);
  }, [courseSlug, lessonSlug]);

  if (loading) {
    return (
      <div className="lesson-page">
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

  if (!lesson) {
    return <p>No lesson found.</p>;
  }

  return (
    <div className="lesson-page">
    <BackButton text="Back to Lessons" />

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
