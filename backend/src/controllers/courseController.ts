import type { Request, Response } from "express";
import pool from "../db.js";
import type { Course } from "../types/course.js";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Course>(
      `SELECT
        course_id as id,
        course_title as name,
        course_slug AS slug,
        course_description as description
        FROM courses 
        ORDER BY course_title ASC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch courses",
    });
  }
};

export const getCourseBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await pool.query<Course>(
      `SELECT
        course_id AS id,
        course_title AS name,
        course_slug AS slug,
        course_description AS description
       FROM courses
       WHERE course_slug = $1`,
      [slug],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch course",
    });
  }
};
