// Mirror envelope của MeagoServer (TransformInterceptor + BaseService.findMulti)
export interface IBaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface IPaginatedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
}

export interface IBaseQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  search?: string;
}

export interface IErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}
