import type { Request, Response } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export const processMockPayment = async (req: Request, res: Response): Promise<any> => {

    const client = await pool.connect();
    
    try {
        const { plan_id } = req.body;
        const userId = MOCK_USER_ID;

        if (!plan_id) {
            return res.status(400).json({ error: 'plan_id is required in the request body' });
        }

        await client.query('BEGIN');

        const planResult = await client.query('SELECT * FROM plans WHERE plan_id = $1', [plan_id]);
        if (planResult.rows.length === 0) {
            throw new Error('Plan not found');
        }
        const plan = planResult.rows[0];

        await client.query(`
            UPDATE subscriptions 
            SET status = 'canceled', canceled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND status = 'active'
        `, [userId]);

        const subscriptionId = uuidv4();
        await client.query(`
            INSERT INTO subscriptions (subscription_id, user_id, plan_id, status, current_period_start, current_period_end)
            VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days')
        `, [subscriptionId, userId, plan_id]);

        const paymentId = uuidv4();
        await client.query(`
            INSERT INTO payments (payment_id, user_id, subscription_id, amount_paid, currency, status)
            VALUES ($1, $2, $3, $4, $5, 'completed')
        `, [paymentId, userId, subscriptionId, plan.price, plan.currency]);

        await client.query('COMMIT');

        res.status(200).json({ 
            message: 'Payment successful', 
            receiptId: paymentId,
            planName: plan.name
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment failed' });
    } finally {
        client.release();
    }
};