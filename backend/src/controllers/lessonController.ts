import type { Request, Response } from "express";
import pool from "../db.js";
import type { Lesson } from "../types/lesson.js";

export const getLessonsByCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const result = await pool.query<Lesson>(
      `SELECT
        l.lesson_id AS id,
        l.course_id,
        l.lesson_title AS title,
        l.lesson_slug AS slug,
        l.content_body AS content,
        l.media_url,
        l.duration_seconds,
        l.sequence_order
       FROM lessons l
       JOIN courses c ON l.course_id = c.course_id
       WHERE c.course_slug = $1
       AND l.status = 'published'
       ORDER BY l.sequence_order ASC`,
      [slug]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch lessons",
    });
  }
};