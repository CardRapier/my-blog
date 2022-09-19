export interface BlogResponse<T> {
  data: T;
}

export interface BlogResponseM<T> {
  data: T;
  message: string;
}

export interface PaginationResponse<T> {
  data: T;
  quantity: number;
  total: number;
}
