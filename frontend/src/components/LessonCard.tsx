import { Link } from "react-router-dom";
import type { Lesson } from "../types/lesson";
import "./LessonCard.css";

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <Link to={`/courses/${lesson.course_slug}/lessons/${lesson.slug}`}>
      <div className="lesson-card">
        <h3>
          {lesson.sequence_order}. {lesson.title}
        </h3>
        <p>{lesson.description}</p>
        <p>Duration: {Math.ceil(lesson.duration_seconds / 60)} min</p>
      </div>
    </Link>
  );
};

export default LessonCard;
