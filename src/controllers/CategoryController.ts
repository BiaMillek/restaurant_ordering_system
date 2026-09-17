import type { Request, Response } from "express";
import Category from "../models/Category.js";

async function getAll(req: Request, res: Response) {
  try {
    try {
      const categories = await Category.findAll();

      res.status(200).json(categories);
    } catch (error) {
      console.log("Erro ao buscar categorias: ", error);

      res.status(404).json({
        message: "Erro ao buscar categorias.",
      });
    }
  } catch (error) {}
}

async function getById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "ID da Categoria não informado.",
    });
  }
  try {
    const category = await Category.findById(id);

    res.status(200).json(category);
  } catch (error) {
    console.log("Erro ao buscar categoria: ", error);

    res.status(404).json({
      message: "Erro ao buscar categoria.",
    });
  }
}

async function create(req: Request, res: Response) {
  try {
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (error) {
    console.log("Erro ao criar categoria: ", error);

    res.status(500).json({
      message: "Erro ao criar categoria.",
    });
  }
}

async function update(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "ID da Categoria não informado.",
    });
  }

  try {
    const category = await Category.update(id, req.body);

    res.status(200).json(category);
  } catch (error) {
    console.log("Erro ao atualizar categoria: ", error);

    res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }
}

async function remove(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "ID da Categoria não informado.",
    });
  }

  try {
    const category = await Category.remove(id);

    res.status(200).json({
      message: "Categoria removida com sucesso!",
    });
  } catch (error) {
    console.log("Erro ao remover categoria: ", error);

    res.status(404).json({
      message: "Categoria não encontrada.",
    });
  }
}

async function getByKeyword(
    req: Request<{ keyword: string }>, 
    res: Response
) {
  const { keyword } = req.params;

  if (!keyword || typeof keyword != "string") {
    return res.status(400).json({
      message: "Palavra-chave não informada.",
    });
  }

  try {
    const categories = await Category.findByKeyword(keyword);

    res.status(200).json(categories);
  } catch (error) {
    console.log("Erro ao pesquisar categorias: ", error);

    res.status(404).json({
      message: "Erro ao buscar categorias.",
    });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getByKeyword,
};
