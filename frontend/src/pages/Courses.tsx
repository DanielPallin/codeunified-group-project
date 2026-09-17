import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import CourseCard from "../components/CourseCard";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3000/api/courses");

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses-page">
      <h1 className="courses-selection-title">Choose Your Course</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <section>
        <h3 className="courses-section-title">Basic</h3>

        {courses
          .filter((course) => course.min_access_level === 1)
          .map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </section>

      <section>
        <h3 className="courses-section-title">Plus</h3>

        {courses
          .filter((course) => course.min_access_level === 2)
          .map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </section>

      <section>
        <h3 className="courses-section-title">Pro</h3>

        {courses
          .filter((course) => course.min_access_level === 3)
          .map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </section>
    </div>
  );
};

export default Courses;
