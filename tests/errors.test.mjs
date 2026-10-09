import test from "node:test";
import assert from "node:assert/strict";
import { isUUID, NotFoundError, databaseErrorStatus } from "../dist/utils/errors.js";

test("aceita UUID válido e rejeita UUID inválido", () => {
  assert.equal(isUUID("fd694638-eb70-4430-b6d7-8e785f57c955"), true);
  assert.equal(isUUID("123"), false);
  assert.equal(isUUID(null), false);
});
test("erro de categoria inexistente tem tipo próprio", () => {
  assert.equal(new NotFoundError("Categoria não encontrada.") instanceof NotFoundError, true);
});
test("restrição de chave estrangeira retorna conflito", () => {
  assert.equal(databaseErrorStatus({code:"23503"}), 409);
  assert.equal(databaseErrorStatus({code:"23505"}), 409);
  assert.equal(databaseErrorStatus({code:"XX999"}), 500);
});
