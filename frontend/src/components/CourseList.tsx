import CourseCard from "./CourseCard";
import type { Course } from "../types/course";

const CourseList = ({ courses }: { courses: Course[] }) => {
  return (
    <div>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
