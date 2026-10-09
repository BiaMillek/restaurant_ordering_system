# Restaurant Ordering System — API REST

Projeto acadêmico de Desenvolvimento Back-end (Engenharia de Software), com **Node.js, TypeScript, Express 5 e Supabase (PostgreSQL)**.

## Funcionalidades

- CRUD de categorias e produtos.
- Pesquisa de categorias por palavra-chave.
- Validação de dados, UUIDs e respostas HTTP (`200`, `201`, `400`, `404`, `409`, `500`).
- Relacionamento `products.category_id` → `categories.id` no PostgreSQL.
- Separação entre rotas, controllers, models e repositories.

## Pré-requisitos

- Node.js compatível com `--env-file` (recomendado Node 22 ou superior).
- Projeto Supabase com tabelas `categories` e `products` configuradas.

## Instalação

```bash
npm ci
```

Copie `.env.example` para `.env` e preencha `SUPABASE_URL` e `SUPABASE_SECRET_KEY` com os valores do **seu projeto Supabase**. A chave secreta é exclusivamente de backend. **Nunca envie `.env` ao GitHub.**

```bash
npm run dev
```

API local: `http://localhost:3000`.

## Compilação e testes

```bash
npm run build
npm test
npm start
```

Os testes automatizados cobrem funções utilitárias. Os testes CRUD completos devem ser feitos no Postman com um Supabase configurado.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Informações da API |
| GET | `/categories` | Listar categorias |
| GET | `/categories/:id` | Buscar categoria por UUID |
| GET | `/categories/search/:keyword` | Pesquisar categorias |
| POST | `/categories` | Cadastrar categoria |
| PUT | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Excluir categoria |
| GET | `/products` | Listar produtos |
| GET | `/products/:id` | Buscar produto por UUID |
| POST | `/products` | Cadastrar produto |
| PUT | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Excluir produto |

### Exemplos

**POST `/categories`**

```json
{"name":"Lanches","description":"Hambúrgueres e sanduíches","icon":"burger","display_order":1}
```

**POST `/products`** — substitua `category_id` por um UUID existente em `/categories`:

```json
{"category_id":"fd694638-eb70-4430-b6d7-8e785f57c955","title":"X-Burger","description":"Hambúrguer com queijo","price":25.90,"available":true,"active":true}
```

**PUT** aceita somente os campos a alterar; **GET** e **DELETE** não exigem body.

## Banco de dados

As tabelas Supabase devem possuir, no mínimo:

- `categories`: `id` (UUID PK), `name` (varchar 100), `description` (varchar 255, opcional), `icon` (varchar 10, opcional), `display_order` (integer), `active` (boolean), `created_at` e `updated_at` (timestamptz).
- `products`: `id` (UUID PK), `category_id` (UUID FK para `categories.id`), `title` (varchar 150), `description` (varchar 500, opcional), `price` (numeric), `image` (varchar 255, opcional), `available` (boolean), `active` (boolean), `created_at` e `updated_at` (timestamptz).

Os IDs devem ter `gen_random_uuid()` como valor padrão. A aplicação não cria automaticamente as tabelas; utilize o SQL Editor do Supabase para prepará-las.

## Observações

- Excluir categoria com produtos vinculados pode resultar em `409 Conflict` por integridade referencial.
- Não publique credenciais, nem use a chave secreta do Supabase no frontend.
- A coleção em `postman/` pode ser importada no Postman. Preencha `category_id`, `product_id` e `base_url` nas variáveis da coleção.

**Autoria:** Bianca Millek.
