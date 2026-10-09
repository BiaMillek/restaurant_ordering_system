
import supabase from "../config/supabase.js";

export interface ProductData {
  category_id: string;
  title: string;
  description?: string | null;
  price: number;
  image?: string | null;
  available?: boolean;
  active?: boolean;
}

async function findAll() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;

  return data;
}

async function findById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function create(product: ProductData) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function update(id: string, product: Partial<ProductData>) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function remove(id: string) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

export default {
  findAll,
  findById,
  create,
  update,
  remove,
};
