import type { Lesson } from "../types/lesson";
import "./LessonCard.css";

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="lesson-card">
      <h3>
        {lesson.sequence_order}. {lesson.title}
      </h3>
      <p>{lesson.content}</p>
    </div>
  );
};

export default LessonCard;
