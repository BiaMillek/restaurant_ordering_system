import type { Request, Response } from "express";
import CategoryRepository from "../repositories/CategoryRepository.js";
import { Category } from "../models/Category.js";
import { NotFoundError, isUUID, databaseErrorStatus } from "../utils/errors.js";

type CategoryInput = {
  name?: string;
  description?: string;
  icon?: string;
  display_order?: number;
  active?: boolean;
};

function validate(body: unknown, partial: boolean): { data?: CategoryInput; error?: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return { error: "Envie um objeto JSON válido." };
  const obj = body as Record<string, unknown>;
  const allowed = ["name", "description", "icon", "display_order", "active"];
  if (Object.keys(obj).some(k => !allowed.includes(k))) return { error: "A requisição contém campos não permitidos." };
  if (partial && Object.keys(obj).length === 0) return { error: "Informe pelo menos um campo para atualizar." };
  if (!partial || obj.name !== undefined) {
    if (typeof obj.name !== "string" || !obj.name.trim() || obj.name.length > 100) return { error: "Nome obrigatório, com até 100 caracteres." };
  }
  if (!partial || obj.display_order !== undefined) {
    if (!Number.isInteger(obj.display_order) || (obj.display_order as number) < 0) return { error: "A ordem de exibição deve ser um inteiro não negativo." };
  }
  if (obj.description !== undefined && (typeof obj.description !== "string" || obj.description.length > 255)) return { error: "Descrição inválida (máximo de 255 caracteres)." };
  if (obj.icon !== undefined && (typeof obj.icon !== "string" || obj.icon.length > 10)) return { error: "Ícone inválido (máximo de 10 caracteres)." };
  if (obj.active !== undefined && typeof obj.active !== "boolean") return { error: "active deve ser booleano." };
  if (!partial && obj.active !== undefined) return { error: "O status active deve ser alterado pela atualização." };
  return { data: { ...obj, ...(typeof obj.name === "string" ? { name: obj.name.trim() } : {}) } as CategoryInput };
}

function handleError(error: unknown, res: Response) {
  if (error instanceof NotFoundError) return res.status(404).json({ message: error.message });
  console.error("Erro na operação com categorias:", error);
  const status = databaseErrorStatus(error);
  if (status === 409) return res.status(409).json({ message: "Operação não permitida por restrição ou relacionamento no banco de dados." });
  return res.status(500).json({ message: "Erro interno ao processar categoria." });
}

async function getAll(_req: Request, res: Response) {
  try { return res.status(200).json(await CategoryRepository.findAll()); }
  catch (error) { return handleError(error, res); }
}

async function getById(req: Request<{ id: string }>, res: Response) {
  if (!isUUID(req.params.id)) return res.status(400).json({ message: "UUID inválido." });
  try {
    const category = await CategoryRepository.findById(req.params.id);
    return res.status(200).json({ id: category.getId(), name: category.getName(), description: category.getDescription(), icon: category.getIcon(), display_order: category.getDisplayOrder(), active: category.isActive() });
  } catch (error) { return handleError(error, res); }
}

async function create(req: Request, res: Response) {
  const validation = validate(req.body, false);
  if (validation.error) return res.status(400).json({ message: validation.error });
  const data = validation.data!;
  try {
    const category = new Category(data.name!, data.display_order!, data.description, data.icon);
    return res.status(201).json(await CategoryRepository.create(category));
  } catch (error) { return handleError(error, res); }
}

async function update(req: Request<{ id: string }>, res: Response) {
  if (!isUUID(req.params.id)) return res.status(400).json({ message: "UUID inválido." });
  const validation = validate(req.body, true);
  if (validation.error) return res.status(400).json({ message: validation.error });
  const data = validation.data!;
  try {
    const category = await CategoryRepository.findById(req.params.id);
    if (data.name !== undefined) category.rename(data.name);
    if (data.description !== undefined) category.changeDescription(data.description);
    if (data.icon !== undefined) category.changeIcon(data.icon);
    if (data.display_order !== undefined) category.changeDisplayOrder(data.display_order);
    if (data.active !== undefined) data.active ? category.activate() : category.deactivate();
    return res.status(200).json(await CategoryRepository.update(category));
  } catch (error) { return handleError(error, res); }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  if (!isUUID(req.params.id)) return res.status(400).json({ message: "UUID inválido." });
  try {
    await CategoryRepository.remove(req.params.id);
    return res.status(200).json({ message: "Categoria removida com sucesso!" });
  } catch (error) { return handleError(error, res); }
}

async function getByKeyword(req: Request<{ keyword: string }>, res: Response) {
  const keyword = req.params.keyword?.trim();
  if (!keyword || keyword.length > 100 || !/[\p{L}\p{N}]/u.test(keyword)) return res.status(400).json({ message: "Palavra-chave inválida." });
  try { return res.status(200).json(await CategoryRepository.findByKeyword(keyword)); }
  catch (error) { return handleError(error, res); }
}

export default { getAll, getById, create, update, remove, getByKeyword };
