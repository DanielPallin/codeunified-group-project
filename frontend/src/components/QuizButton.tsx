import { useNavigate } from "react-router-dom";
import type { Course } from "../types/course";

const QuizButton = ({ course }: { course: Course }) => {
const navigate = useNavigate();

  return (
      <button
        className="quiz-button"
        onClick={() => navigate(`/courses/${course.slug}/quiz`)}
      >
        Take Quiz
      </button>
  );
};

export default QuizButton;
