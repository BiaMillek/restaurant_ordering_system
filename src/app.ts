import express from "express";
import { randomUUID } from "node:crypto";
import supabase from "./config/supabase.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

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
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json(categories);
  } catch (error) {
    console.log("Erro ao buscar categorias: ", error);

    res.status(404).json({
      message: "Erro ao buscar categorias.",
    });
  }
});

app.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    res.status(200).json(category);
  } catch (error) {
    console.log("Erro ao buscar categoria: ", error);

    res.status(404).json({
      message: "Erro ao buscar categoria.",
    });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (error) {
    console.log("Erro ao criar categoria: ", error);

    res.status(500).json({
      message: "Erro ao criar categoria.",
    });
  }
});

app.get("/categories/search/:keyword", async (req, res) => {
  try {
    const categories = await Category.findByKeyword(req.params.keyword);

    res.status(200).json(categories);
  } catch (error) {
    console.log("Erro ao pesquisar categorias: ", error);

    res.status(404).json({
      message: "Erro ao buscar categorias.",
    });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.update(req.params.id, req.body);

    res.status(200).json(category);
  } catch (error) {
    console.log("Erro ao atualizar categoria: ", error);

    res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.remove(req.params.id);

    res.status(200).json({
      message: "Categoria removida com sucesso.",
    });
  } catch (error) {
    console.log("Erro ao remover categoria: ", error);

    res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }
});

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

export default app;
