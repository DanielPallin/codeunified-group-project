import LessonCard from "./LessonCard";
import type { Lesson } from "../types/lesson";

const LessonList = ({ lessons }: { lessons: Lesson[] }) => {
  return (
    <div>
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

export default LessonList;
