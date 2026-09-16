import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Course } from "../types/course";

const CoursePage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/courses/${slug}`,
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
    </div>
  );
};

export default CoursePage;
