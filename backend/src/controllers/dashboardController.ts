import type { Request, Response } from 'express';
import pool from "../db.js";

const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export const getCurrentPlan = async (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID; 

        const query = `
            SELECT p.name, p.description, p.access_level, s.status, s.current_period_end
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.plan_id
            WHERE s.user_id = $1 AND s.status = 'active'
        `;
        
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No active subscription found for this user.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching current plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getReceipts = async (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;

        const query = `
            SELECT pay.payment_id, pay.amount_paid, pay.currency, pay.status, pay.created_at, p.name AS plan_name
            FROM payments pay
            LEFT JOIN subscriptions s ON pay.subscription_id = s.subscription_id
            LEFT JOIN plans p ON s.plan_id = p.plan_id
            WHERE pay.user_id = $1
            ORDER BY pay.created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching receipts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMyCourses = async (req: Request, res: Response) => {
    try {
        const userId = MOCK_USER_ID;

        const query = `
            SELECT DISTINCT c.course_id, c.course_title, c.course_slug, c.course_description
            FROM courses c
            JOIN lessons l ON c.course_id = l.course_id
            JOIN user_lesson_progress ulp ON l.lesson_id = ulp.lesson_id
            WHERE ulp.user_id = $1
        `;
        
        const result = await pool.query(query, [userId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching user courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};