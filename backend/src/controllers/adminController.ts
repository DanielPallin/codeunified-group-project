import type { Request, Response } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const MOCK_ADMIN_ID = '999e4567-e89b-12d3-a456-426614174999';

const verifyAdminRole = async (userId: string): Promise<boolean> => {
    const result = await pool.query('SELECT role FROM users WHERE user_id = $1', [userId]);
    return result.rows.length > 0 && result.rows[0].role === 'admin';
};

export const createCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const { course_title, course_slug, course_description, min_access_level } = req.body;

        if (!course_title || !course_slug || min_access_level === undefined) {
            return res.status(400).json({ error: 'Missing required course fields' });
        }

        const courseId = uuidv4();
        const query = `
            INSERT INTO courses (course_id, course_title, course_slug, course_description, status, min_access_level)
            VALUES ($1, $2, $3, $4, 'published', $5)
            RETURNING course_id, course_title;
        `;
        
        const result = await pool.query(query, [
            courseId, 
            course_title, 
            course_slug, 
            course_description, 
            min_access_level
        ]);

        res.status(201).json({ message: 'Course created successfully', course: result.rows[0] });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createLesson = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const { course_id, lesson_title, lesson_slug, content_body, sequence_order, media_url } = req.body;

        if (!course_id || !lesson_title || !lesson_slug) {
            return res.status(400).json({ error: 'Missing required lesson fields' });
        }

        const lessonId = uuidv4();
        const query = `
            INSERT INTO lessons (lesson_id, course_id, lesson_title, lesson_slug, content_body, sequence_order, status, media_url)
            VALUES ($1, $2, $3, $4, $5, $6, 'published', $7)
            RETURNING lesson_id, lesson_title;
        `;
        
        const result = await pool.query(query, [
            lessonId, 
            course_id, 
            lesson_title, 
            lesson_slug, 
            content_body,
            media_url || null, 
            sequence_order || 1
        ]);

        res.status(201).json({ message: 'Lesson created successfully', lesson: result.rows[0] });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCourses = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLessons = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const query = `
            SELECT l.*, c.course_title 
            FROM lessons l 
            JOIN courses c ON l.course_id = c.course_id 
            ORDER BY c.course_title ASC, l.sequence_order ASC
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const { id } = req.params;

        await pool.query('DELETE FROM lessons WHERE course_id = $1', [id]);
        
        const result = await pool.query('DELETE FROM courses WHERE course_id = $1 RETURNING course_id', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ message: 'Course and related lessons deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteLesson = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await verifyAdminRole(MOCK_ADMIN_ID);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }

        const { id } = req.params;
        const result = await pool.query('DELETE FROM lessons WHERE lesson_id = $1 RETURNING lesson_id', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};