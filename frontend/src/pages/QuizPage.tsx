import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./QuizPage.css";
import type { Quiz } from "../types/quiz";
import type { QuizResult } from "../types/quizResult";

const QuizPage = () => {
  const { courseSlug } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:3000/api/courses/${courseSlug}/quiz/submit`,

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
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3000/api/courses/${courseSlug}/quiz`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setQuiz(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (courseSlug) {
      fetchQuiz();
    }
  }, [courseSlug]);

  if (!quiz) {
    return <p>Loading...</p>;
  }
  return (
    <div className="quiz-page">
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
      <button className="submit-button" onClick={handleSubmit}>
        Submit Quiz
      </button>

      {result && (
        <div>
          <h2>Quiz Result</h2>

          <p>
            {result.correct_answers} / {result.total_questions} rätt
          </p>

          <p>Score: {result.score_percentage}%</p>

          <p>{result.passed ? "Passed!" : "Not passed"}</p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
