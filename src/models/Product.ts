import supabase from "../config/supabase.js";

async function findAll() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw error;
  }

  return data;
}

async function create(product: {
  category_id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  active: boolean;
}) {
  const { data, error } = await supabase
  .from("products")
  .insert(product)
  .select()
  .single();

  if (error) {
    throw error;
  }

  return data;
}

export default {
  findAll,
  create,
};
