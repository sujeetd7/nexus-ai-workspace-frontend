let sequence = 0;

export function createId(prefix = "id"): string {
  sequence += 1;

  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}
