import type { Request, Response } from "express";
import pool from "../db.js";
import type { Plan } from "../types/plan.js";

export const getPlans = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Plan>(
      "SELECT plan_id as id, name, price, currency, billing_interval, is_active, description FROM plans ORDER BY access_level ASC",
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch plans",
    });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  const { planId } = req.params;
  try {
    const result = await pool.query<Plan>(
      "SELECT plan_id as id, name, price, currency, billing_interval, is_active, description FROM plans WHERE plan_id = $1",
      [planId],
    );

    res.json(result.rows[0]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch plans",
    });
  }
};
