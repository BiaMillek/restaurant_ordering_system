
import type { Request, Response } from "express";
import ProductRepository, {
  type ProductData,
} from "../repositories/ProductRepository.js";

const isUUID = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

function validateProduct(
  body: unknown,
  partial = false
): { error?: string; product?: Partial<ProductData> } {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return { error: "Envie um objeto JSON válido." };
  }

  const data = body as Record<string, unknown>;
  const product: Partial<ProductData> = {};

  const allowed = [
    "category_id",
    "title",
    "description",
    "price",
    "image",
    "available",
    "active",
  ];

  if (Object.keys(data).some((key) => !allowed.includes(key))) {
    return { error: "A requisição contém campos não permitidos." };
  }

  if (partial && Object.keys(data).length === 0) {
    return { error: "Informe pelo menos um campo para atualizar." };
  }

  if (!partial || data.category_id !== undefined) {
    if (!isUUID(data.category_id)) {
      return { error: "category_id deve ser um UUID válido." };
    }
    product.category_id = data.category_id;
  }

  if (!partial || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      data.title.length > 150
    ) {
      return { error: "Título obrigatório, com até 150 caracteres." };
    }
    product.title = data.title.trim();
  }

  if (!partial || data.price !== undefined) {
    if (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price < 0
    ) {
      return { error: "Preço deve ser um número não negativo." };
    }
    product.price = data.price;
  }

  if (data.description !== undefined) {
    if (
      data.description !== null &&
      (typeof data.description !== "string" ||
        data.description.length > 500)
    ) {
      return { error: "Descrição inválida (máximo de 500 caracteres)." };
    }
    product.description = data.description as string | null;
  }

  if (data.image !== undefined) {
    if (
      data.image !== null &&
      (typeof data.image !== "string" ||
        data.image.length > 255)
    ) {
      return { error: "Imagem inválida (máximo de 255 caracteres)." };
    }
    product.image = data.image as string | null;
  }

  for (const field of ["available", "active"] as const) {
    if (data[field] !== undefined) {
      if (typeof data[field] !== "boolean") {
        return { error: `${field} deve ser true ou false.` };
      }
      product[field] = data[field];
    }
  }

  return { product };
}

function handleError(error: unknown, res: Response) {
  console.error("Erro na operação com produtos:", error);

  const dbError = error as { code?: string };

  if (dbError?.code === "23503") {
    return res.status(400).json({
      message: "Categoria informada não existe ou há uma restrição de relacionamento.",
    });
  }

  if (dbError?.code === "23505") {
    return res.status(409).json({
      message: "Registro duplicado.",
    });
  }

  return res.status(500).json({
    message: "Erro interno ao processar produto.",
  });
}

async function getAll(req: Request, res: Response) {
  try {
    const products = await ProductRepository.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return handleError(error, res);
  }
}

async function getById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ message: "UUID inválido." });
  }

  try {
    const product = await ProductRepository.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(error, res);
  }
}

async function create(req: Request, res: Response) {
  const validation = validateProduct(req.body);

  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  try {
    const product = await ProductRepository.create(
      validation.product as ProductData
    );

    return res.status(201).json(product);
  } catch (error) {
    return handleError(error, res);
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ message: "UUID inválido." });
  }

  const validation = validateProduct(req.body, true);

  if (validation.error) {
    return res.status(400).json({ message: validation.error });
  }

  try {
    const product = await ProductRepository.update(
      id,
      validation.product!
    );

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(error, res);
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res.status(400).json({ message: "UUID inválido." });
  }

  try {
    const product = await ProductRepository.remove(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.status(200).json({
      message: "Produto removido com sucesso.",
      product,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
