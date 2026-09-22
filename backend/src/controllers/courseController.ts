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
        course_description as description,
        min_access_level
        FROM courses 
        ORDER BY min_access_level ASC`,
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
    const userId = (req as any).user?.userId;

    const result = await pool.query<Course>(
      `SELECT
        course_id AS id,
        course_title AS name,
        course_slug AS slug,
        course_description AS description,
        min_access_level
       FROM courses
       WHERE course_slug = $1`,
      [slug],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const course = result.rows[0]!;
    let userAccessLevel = 0;

    if (userId) {
      const subResult = await pool.query(
        `SELECT p.access_level
         FROM subscriptions s
         JOIN plans p ON s.plan_id = p.plan_id
         WHERE s.user_id = $1 AND s.status = 'active'`,
        [userId]
      );

      if (subResult.rows.length > 0) {
        userAccessLevel = subResult.rows[0].access_level;
      }
    }

    if (userAccessLevel < course.min_access_level) {
      return res.status(403).json({
        message: "You need to upgrade your subscription to access this course.",
        requiredLevel: course.min_access_level,
        currentLevel: userAccessLevel,
        course: course
      });
    }

    res.json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch course",
    });
  }
};