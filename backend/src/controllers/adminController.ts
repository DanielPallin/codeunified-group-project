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

        const { course_id, lesson_title, lesson_slug, content_body, sequence_order } = req.body;

        if (!course_id || !lesson_title || !lesson_slug) {
            return res.status(400).json({ error: 'Missing required lesson fields' });
        }

        const lessonId = uuidv4();
        const query = `
            INSERT INTO lessons (lesson_id, course_id, lesson_title, lesson_slug, content_body, sequence_order, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'published')
            RETURNING lesson_id, lesson_title;
        `;
        
        const result = await pool.query(query, [
            lessonId, 
            course_id, 
            lesson_title, 
            lesson_slug, 
            content_body, 
            sequence_order || 1
        ]);

        res.status(201).json({ message: 'Lesson created successfully', lesson: result.rows[0] });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};