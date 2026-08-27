import express from "express";
import { randomUUID } from "node:crypto";

const app = express();
app.use(express.json());

const pizzaCategoryId = randomUUID();
const drinkCategoryId = randomUUID();

const categories = [
  {
    id: pizzaCategoryId,
    name: "Pizzas",
    description:
      "Pizzas salgadas com diferentes sabores, tamanhos e combinações de ingredientes.",
  },
  {
    id: drinkCategoryId,
    name: "Bebidas",
    description:
      "Bebidas para acompanhar as pizzas, incluindo refrigerantes, sucos e água.",
  },
];

const products = [
  {
    id: randomUUID(),
    categoryId: pizzaCategoryId,
    name: "Calabresa",
    description:
      "Pizza com molho de tomate, muçarela, calabresa fatiada e cebola.",
    price: 45.9,
  },
  {
    id: randomUUID(),
    categoryId: pizzaCategoryId,
    name: "Frango com Catupiry",
    description:
      "Pizza com molho de tomate, muçarela, frango desfiado e catupiry.",
    price: 49.9,
  },
  {
    id: randomUUID(),
    categoryId: pizzaCategoryId,
    name: "Margherita",
    description:
      "Pizza com molho de tomate, muçarela, tomate e manjericão fresco.",
    price: 44.9,
  },
  {
    id: randomUUID(),
    categoryId: drinkCategoryId,
    name: "Coca-Cola 2L",
    description: "Refrigerante Coca-Cola em garrafa de 2 litros.",
    price: 12.9,
  },
  {
    id: randomUUID(),
    categoryId: drinkCategoryId,
    name: "Suco de Laranja",
    description: "Suco natural de laranja, servido gelado.",
    price: 9.9,
  },
  {
    id: randomUUID,
    categoryId: pizzaCategoryId,
    name: "Pizza de Chocolate",
    description: "Pizza doce com chocolate cremoso e granulado.",
    price: 39.9,
  },
];

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
  const category = {
    id: randomUUID(),
    ...req.body,
  };
  categories.push(category);
  res.status(201).json(category);
});

app.put("/categories/:id", (req, res) => {
  const category = categories.find((category) => {
    return category.id == req.params.id;
  });

  if (!category) {
    return res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }

  category.name = req.body.name;
  category.description = req.body.description;

  res.status(200).json(category);
});

app.delete("/categories/:id", (req, res) => {
  const category = categories.find((category) => {
    return category.id == req.params.id;
  });

  if (!category) {
    return res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }

  const index = categories.indexOf(category);
  categories.splice(index, 1);

  res.status(200).json({
    message: "Categoria removida com sucesso.",
  });
});

// ==========================
// Products
// ==========================
app.get("/products", (req, res) => {
  res.status(200).json(products);
});

app.post("/products", (req, res) => {
  const product = {
    id: randomUUID(),
    ...req.body,
  };
  products.push(product);
  res.status(201).json(product);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((product) => {
    return product.id == req.params.id;
  });
  if (!product) {
    return res.status(404).json({
      message: "Produto não encontrado.",
    });
  }
  res.status(200).json(product);
});

app.put("/products/:id", (req, res) => {
  const product = products.find((product) => {
    return product.id == req.params.id;
  });
  if (!product) {
    return res.status(404).json({
      message: "Produto não encontrado.",
    });
  }

  product.categoryId = req.body.categoryId;
  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;

  res.status(200).json(product);
});

app.delete("/products/:id", (req, res) => {
  const product = products.find((product) => {
    return product.id == req.params.id;
  });
  if (!product) {
    return res.status(404).json({
      message: "Produto não encontrado.",
    });
  }

  const index = products.indexOf(product);
  products.splice(index, 1);

  res.status(200).json({
    message: "Produto removido com sucesso.",
  });
});

app.get("/test-supabase", async (req, res) => {
  //criar teste de conexão...
})

export default app;
