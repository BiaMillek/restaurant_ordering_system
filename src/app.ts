import express from "express";
import categoryRoutes from "./routes/categoryRouter.js";

const app = express();
app.use(express.json());

// ==========================
// Root
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Restaurant Ordering System API",
    version: "1.0.0",
  });
});

// ==========================
// Categories
// ==========================
app.use("/categories", categoryRoutes);

export default app;
