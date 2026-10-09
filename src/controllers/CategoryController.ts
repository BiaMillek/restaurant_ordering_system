import type { Request, Response } from "express";
import CategoryRepository from "../repositories/CategoryRepository.js";
import { Category } from "../models/Category.js";


async function getAll(req: Request, res: Response) {
  try {
    const categories = await CategoryRepository.findAll();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar categorias.",
    });
  }
}


async function getById(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "ID da Categoria não informado.",
    });
  }
  try {
    const category = await CategoryRepository.findById(id);

    res.status(200).json({
      id: category.getId(),
      name: category.getName(),
      description: category.getDescription(),
      icon: category.getIcon(),
      display_order: category.getDisplayOrder(),
      active: category.isActive(),
    });
  } catch (error) {
    console.log("Erro ao buscar categoria: ", error);

    res.status(404).json({
      message: "Erro ao buscar categoria.",
    });
  }
}


async function create(req: Request, res: Response) {
  const { name, display_order, description, icon } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "O nome da categoria é obrigatório.",
    });
  }

  if (!Number.isInteger(display_order) || display_order < 0) {
    return res.status(400).json({
      message: "A ordem de exibição deve ser um número inteiro não negativo.",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Descrição inválida.",
    });
  }

  if (icon !== undefined && typeof icon !== "string") {
    return res.status(400).json({
      message: "Ícone inválido.",
    });
  }

  try {
    const category = new Category(
      name.trim(),
      display_order,
      description,
      icon
    );

    const createdCategory = await CategoryRepository.create(category);

    return res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);

    return res.status(500).json({
      message: "Erro interno ao criar categoria.",
    });
  }
}




async function update(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const { name, display_order, description, icon, active } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "ID da categoria não informado.",
    });
  }

  try {
    const category = await CategoryRepository.findById(id);

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Nome da categoria inválido.",
        });
      }
      category.rename(name.trim());
    }

    if (display_order !== undefined) {
      if (!Number.isInteger(display_order) || display_order < 0) {
        return res.status(400).json({
          message: "Ordem de exibição inválida.",
        });
      }
      category.changeDisplayOrder(display_order);
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Descrição inválida.",
        });
      }
      category.changeDescription(description);
    }

    if (icon !== undefined) {
      if (typeof icon !== "string") {
        return res.status(400).json({
          message: "Ícone inválido.",
        });
      }
      category.changeIcon(icon);
    }

    if (active !== undefined) {
      if (typeof active !== "boolean") {
        return res.status(400).json({
          message: "O campo active deve ser booleano.",
        });
      }

      if (active) {
        category.activate();
      } else {
        category.deactivate();
      }
    }

    const updatedCategory = await CategoryRepository.update(category);

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);

    return res.status(500).json({
      message: "Erro ao atualizar categoria.",
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
    const category = await CategoryRepository.remove(id);

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

async function getByKeyword(req: Request<{ keyword: string }>, res: Response) {
  const { keyword } = req.params;

  if (!keyword || typeof keyword != "string") {
    return res.status(400).json({
      message: "Palavra-chave não informada.",
    });
  }

  try {
    const categories = await CategoryRepository.findByKeyword(keyword);

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
