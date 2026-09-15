import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import planRoutes from "./routes/planRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Project API is running!");
});

app.use("/api/plans", planRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
