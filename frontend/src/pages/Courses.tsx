import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import CourseCard from "../components/CourseCard";

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
    <div>
      <h1>Courses</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <h2>Choose your course</h2>

      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default Courses;
