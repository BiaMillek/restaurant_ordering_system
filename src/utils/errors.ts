export class NotFoundError extends Error {
  constructor(message: string) { super(message); this.name = "NotFoundError"; }
}
export function isUUID(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function databaseErrorStatus(error: unknown): number {
  const code = (error as { code?: string } | null)?.code;
  return code === "23503" || code === "23514" ? 409 : code === "23505" ? 409 : 500;
}
