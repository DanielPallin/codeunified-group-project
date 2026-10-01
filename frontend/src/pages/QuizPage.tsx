import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./QuizPage.css";
import type { Quiz } from "../types/quiz";
import type { QuizResult } from "../types/quizResult";
import BackButton from "../components/BackButton";

const QuizPage = () => {
  const { courseSlug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const API_URL = import.meta.env.PROD 
        ? 'https://codeunified-group-project.onrender.com' 
        : 'http://localhost:3000';

      const response = await axios.post(
        `${API_URL}/api/courses/${courseSlug}/quiz/submit`,
        {
          answers: selectedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to submit quiz");
      } else {
        setError("Failed to submit quiz");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 500);
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");

        const API_URL = import.meta.env.PROD 
          ? 'https://codeunified-group-project.onrender.com' 
          : 'http://localhost:3000';

        const response = await axios.get(
          `${API_URL}/api/courses/${courseSlug}/quiz`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setQuiz(response.data);
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch quiz");
        } else {
          setError("Failed to fetch quiz");
        }
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };

    if (courseSlug) {
      fetchQuiz();
      return () => clearTimeout(timer);
    }
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="quiz-page">
        {showLoader && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-page">
        <p>{error || "Quiz could not be loaded."}</p>
      </div>
    );
  }

  const allQuestionsAnswered =
    quiz.questions.length === Object.keys(selectedAnswers).length;
  return (
    <main className="quiz-page">
      <BackButton text="Back to Course" />
      <h1 className="quiz-title">{quiz.quiz_title}</h1>

      {quiz.questions.map((question) => (
        <div className="quiz-question" key={question.quiz_question_id}>
          <h2>
            {question.sequence_order}. {question.question_text}
          </h2>
          <div className="quiz-options">
            {question.options.map((option) => (
              <button
                key={option.quiz_option_id}
                className={
                  selectedAnswers[question.quiz_question_id] ===
                  option.quiz_option_id
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setSelectedAnswers((prev) => ({
                    ...prev,

                    [question.quiz_question_id]: option.quiz_option_id,
                  }))
                }
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!allQuestionsAnswered}
      >
        Submit Quiz
      </button>

      {result && (
        <div>
          <h2>Quiz Result</h2>

          <p>
            {result.correct_answers} / {result.total_questions} correct
          </p>

          <p>Score: {result.score_percentage}%</p>

          <p>{result.passed ? "Passed!" : "Not passed"}</p>
        </div>
      )}
    </main>
  );
};

export default QuizPage;
