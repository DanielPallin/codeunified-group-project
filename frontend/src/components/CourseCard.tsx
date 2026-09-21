import type { Course } from "../types/course";
import { Link } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link to={`/courses/${course.slug}`}>
      <div className="course-card">
        <h3>{course.name}</h3>
        <p className="course-description">{course.description}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
