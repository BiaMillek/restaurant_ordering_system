import express from "express";
import { randomUUID } from "node:crypto";

const app = express();

app.use(express.json());

//const pizzaCategoryId = randomUUID();
//const drinkCategoryId = randomUUID();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Restaurant Ordering System API",
    version: "1.0.0",
  });
});

const categories = [
  {
    id: randomUUID(),
    name: "Pizzas",
    description:
      "Pizzas salgadas com diferentes sabores, tamanhos e combinações de ingredientes.",
  },
  {
    id: randomUUID(),
    name: "Bebidas",
    description:
      "Bebidas para acompanhar as pizzas, incluindo refrigerantes, sucos e água.",
  },
  {
    id: randomUUID(),
    name: "Sobremesas",
    description:
      "Opções doces para finalizar a refeição, como pizzas doces, sorvetes e sobremesas especiais.",
  },
];

const products = [
  {
    id: 1,
    categoryId: 1,
    name: "Calabresa",
    description:
      "Pizza com molho de tomate, muçarela, calabresa fatiada e cebola.",
    price: 45.9,
  },
  {
    id: 2,
    categoryId: 1,
    name: "Frango com Catupiry",
    description:
      "Pizza com molho de tomate, muçarela, frango desfiado e catupiry.",
    price: 49.9,
  },
  {
    id: 3,
    categoryId: 1,
    name: "Margherita",
    description:
      "Pizza com molho de tomate, muçarela, tomate e manjericão fresco.",
    price: 44.9,
  },
  {
    id: 4,
    categoryId: 2,
    name: "Coca-Cola 2L",
    description: "Refrigerante Coca-Cola em garrafa de 2 litros.",
    price: 12.9,
  },
  {
    id: 5,
    categoryId: 2,
    name: "Suco de Laranja",
    description: "Suco natural de laranja, servido gelado.",
    price: 9.9,
  },
  {
    id: 6,
    categoryId: 3,
    name: "Pizza de Chocolate",
    description: "Pizza doce com chocolate cremoso e granulado.",
    price: 39.9,
  },
];

app.get("/categories", (req, res) => {
  res.status(200).json(categories);
});

app.get("/categories/:id", (req, res) => {
  const category = categories.find((category) => {
    return category.id == req.params.id;
  });

  if (!category) {
    return res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }

  res.status(200).json(category);
});

app.post("/categories", (req, res) => {
  const category = req.body;
  categories.push(category);
  res.status(201).json(category);
});

app.get("/products", (req, res) => {
  res.status(200).json(products);
});

app.post("/products", (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).json(product);
});

export default app;
