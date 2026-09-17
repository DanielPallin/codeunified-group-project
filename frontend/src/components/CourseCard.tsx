import type { Course } from "../types/course";
import { Link } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="course-card">
      <h3>{course.name}</h3>
      <p>{course.description}</p>
      <Link to={`/courses/${course.slug}`}>View course</Link>
    </div>
  );
};

export default CourseCard;
