import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

export default app;