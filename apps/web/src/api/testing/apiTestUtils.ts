export function createMockResponse<T>(data: T) {
  return {
    data,
    status: 200,
  };
}
