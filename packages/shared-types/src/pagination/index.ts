/** Offset/limit style page request. */
export interface PageRequest {
  readonly page: number;
  readonly pageSize: number;
}

/** Offset/limit style page response. */
export interface PageResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasNext: boolean;
}

/** Cursor style page request. */
export interface CursorPageRequest {
  readonly cursor?: string;
  readonly limit: number;
}

/** Cursor style page response. */
export interface CursorPageResponse<T> {
  readonly items: readonly T[];
  readonly nextCursor?: string;
  readonly hasNext: boolean;
}
