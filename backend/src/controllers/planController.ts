import type { Request, Response } from "express";
import pool from "../db.js";
import type { Plan } from "../types/plan.js";

export const getPlans = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Plan>(
      "SELECT plan_id as id, name, price, currency, billing_interval, is_active, description FROM plans ORDER BY access_level ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch plans",
    });
  }
};