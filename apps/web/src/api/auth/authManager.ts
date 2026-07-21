import { clearTokens } from "./authStorage";

export type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | undefined;

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | undefined,
): void {
  unauthorizedHandler = handler;
}

export function logout(): void {
  clearTokens();
  unauthorizedHandler?.();
}
