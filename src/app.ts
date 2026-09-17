import express from "express";
import { randomUUID } from "node:crypto";
import supabase from "./config/supabase.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

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



/*

// ==========================
// Products
// ==========================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();

    res.status(200).json(products);
  } catch (error) {
    console.log("Erro ao buscar produtos: ", error);

    res.status(500).json({
      message: "Erro ao buscar produtos.",
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    console.log("Erro ao criar produto: ", error);

    res.status(500).json({
      message: "Erro ao criar produto.",
    });
  }
});

*/

export default app;
