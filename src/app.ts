
import express from "express";
import categoryRoutes from "./routes/categoryRouter.js";
import productRoutes from "./routes/productRouter.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Restaurant Ordering System API",
    version: "1.0.0",
  });
});

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

export default app;
