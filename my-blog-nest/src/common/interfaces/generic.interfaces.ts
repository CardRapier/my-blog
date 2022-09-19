export interface PostPaginationParams {
  params: any;
  count: number;
}

export interface Params {
  take: number;
  skip: number;
  cursor: { id: number } | undefined;
  orderBy: any;
}

export interface PaginationQuery {
  page?: number;
  cursor?: number;
  published?: boolean;
}
