export interface URLShortenResponse {
  shortUrl: string;
  originalUrl: string;
  alias: string;
  createdAt: string;
  clicks?: number;
}

export interface URLHistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias: string;
  createdAt: string;
  clicks: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  results?: T;
  error?: string;
}

export interface EnvironmentVariables {
  REACT_APP_BASE_URL_FOR_URL_SHORTENER: string;
}
