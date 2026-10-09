/** Dados de domínio de um produto; acesso ao banco fica no ProductRepository. */
export interface ProductData {
  category_id: string;
  title: string;
  description?: string | null;
  price: number;
  image?: string | null;
  available?: boolean;
  active?: boolean;
}
