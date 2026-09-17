import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import planRoutes from "./routes/planRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import lessonRoutes from "./routes/courseRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Project API is running!");
});
app.use("/api/courses", courseRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
