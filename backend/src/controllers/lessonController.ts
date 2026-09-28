import type { Request, Response } from "express";
import pool from "../db.js";
import type { Lesson } from "../types/lesson.js";

export const getLessonsByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const userId = (req as any).user?.userId;

    const courseRes = await pool.query(
      `SELECT min_access_level FROM courses WHERE course_slug = $1`,
      [slug]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const minAccessLevel = courseRes.rows[0].min_access_level;
    let userAccessLevel = 0;

    if (userId) {
      const subRes = await pool.query(
        `SELECT p.access_level
         FROM subscriptions s
         JOIN plans p ON s.plan_id = p.plan_id
         WHERE s.user_id = $1 AND s.status = 'active'`,
        [userId]
      );

      if (subRes.rows.length > 0) {
        userAccessLevel = subRes.rows[0].access_level;
      }
    }

    if (userAccessLevel < minAccessLevel) {
      return res.status(403).json({
        message: "You need to upgrade your subscription to access these lessons.",
        requiredLevel: minAccessLevel,
        currentLevel: userAccessLevel
      });
    }

    const result = await pool.query<Lesson>(
      `SELECT
        l.lesson_id AS id,
        l.course_id,
        c.course_slug AS course_slug,
        l.lesson_title AS title,
        l.lesson_slug AS slug,
        l.content_body AS content,
        l.lesson_description AS description,
        l.media_url,
        l.duration_seconds,
        l.sequence_order
       FROM lessons l
       JOIN courses c ON l.course_id = c.course_id
       WHERE c.course_slug = $1
       AND l.status = 'published'
       ORDER BY l.sequence_order ASC`,
      [slug],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch lessons",
    });
  }
};

export const getLessonBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const userId = (req as any).user?.userId;

    const courseRes = await pool.query(
      `SELECT min_access_level FROM courses WHERE course_slug = $1`,
      [courseSlug]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const minAccessLevel = courseRes.rows[0].min_access_level;
    let userAccessLevel = 0;

    if (userId) {
      const subRes = await pool.query(
        `SELECT p.access_level
         FROM subscriptions s
         JOIN plans p ON s.plan_id = p.plan_id
         WHERE s.user_id = $1 AND s.status = 'active'`,
        [userId]
      );

      if (subRes.rows.length > 0) {
        userAccessLevel = subRes.rows[0].access_level;
      }
    }

    if (userAccessLevel < minAccessLevel) {
      return res.status(403).json({
        message: "You need to upgrade your subscription to access this lesson.",
        requiredLevel: minAccessLevel,
        currentLevel: userAccessLevel
      });
    }

    const result = await pool.query<Lesson>(
      `SELECT
        l.lesson_id AS id,
        l.course_id,
        l.lesson_title AS title,
        l.lesson_slug AS slug,
        l.content_body AS content,
        l.lesson_description AS description,
        l.media_url,
        l.duration_seconds,
        l.sequence_order
       FROM lessons l
       JOIN courses c
       ON l.course_id = c.course_id
       WHERE c.course_slug = $1
       AND l.lesson_slug = $2
       AND l.status = 'published'`,
      [courseSlug, lessonSlug],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const lesson = result.rows[0]!;
    res.json(lesson);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch lesson",
    });
  }
};