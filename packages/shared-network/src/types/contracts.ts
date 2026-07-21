export interface TokenProvider {
  getAccessToken(): string | null | Promise<string | null>;
}

export interface UnauthorizedHandler {
  onUnauthorized(): void | Promise<void>;
}

export interface NetworkLogger {
  debug?(message: string, metadata?: unknown): void;
  info?(message: string, metadata?: unknown): void;
  warn?(message: string, metadata?: unknown): void;
  error?(message: string, metadata?: unknown): void;
}
