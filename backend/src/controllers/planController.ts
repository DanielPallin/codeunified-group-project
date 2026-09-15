import type { Request, Response } from "express";
import pool from "../db.js";
import type { Plan } from "../types/plan.js";

export const getPlans = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Plan>(
      "SELECT id, name, price, description FROM plans ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch plans",
    });
  }
};