import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 AND deleted_at IS NULL",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const result = await pool.query(
      `INSERT INTO users
        (user_id, firstname, lastname, username, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING user_id, firstname, lastname, username, email, role, created_at`,
      [userId, firstname, lastname, username, email, passwordHash, "user"],
    );

    return res.status(201).json({
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the account",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT
        user_id,
        firstname,
        lastname,
        username,
        email,
        password_hash,
        role
       FROM users
       WHERE email = $1
       AND deleted_at IS NULL`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in",
    });
  }
};
