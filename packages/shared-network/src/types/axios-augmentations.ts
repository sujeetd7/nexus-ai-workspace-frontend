import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * When true, shared-network attaches an Idempotency-Key header if absent.
     */
    idempotent?: boolean;
  }

  interface InternalAxiosRequestConfig {
    idempotent?: boolean;
  }
}

export {};
