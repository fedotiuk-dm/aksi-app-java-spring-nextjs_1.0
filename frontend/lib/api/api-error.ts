import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  message: string;
  errorType?: string;
  path?: string;
  method?: string;
  errorId?: string;
  errors?: Record<string, string>;
  stackTrace?: string[];
}

export class ApiError extends Error {
  status: number;
  errorId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  errors?: Record<string, string>;
  stackTrace?: string[];
  errorType?: string;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = error.errorType || 'ApiError';
    this.status = error.status;
    this.errorId = error.errorId;
    this.timestamp = error.timestamp;
    this.path = error.path;
    this.method = error.method;
    this.errors = error.errors;
    this.stackTrace = error.stackTrace;
    this.errorType = error.errorType;
  }

  getConsoleData(): Record<string, unknown> {
    const consoleData: Record<string, unknown> = {
      message: this.message,
      status: this.status,
    };

    if (this.errorId) consoleData.errorId = this.errorId;
    if (this.path) consoleData.path = this.path;
    if (this.method) consoleData.method = this.method;
    if (this.errorType) consoleData.errorType = this.errorType;
    if (this.errors) consoleData.validationErrors = this.errors;
    if (this.stackTrace) consoleData.stackTrace = this.stackTrace;

    return consoleData;
  }

  logToConsole(): void {
    console.error(`🔴 API Error [${this.status}] ${this.errorId || ''}: ${this.message}`);
    console.error(this.getConsoleData());
  }

  static fromAxiosError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const responseData = error.response.data as Partial<ApiErrorResponse>;

      return new ApiError({
        status: error.response.status,
        message: responseData.message || error.message || "Помилка з'єднання з сервером",
        errorId: responseData.errorId,
        errorType: responseData.errorType,
        path: responseData.path,
        method: responseData.method,
        errors: responseData.errors,
        stackTrace: responseData.stackTrace,
      });
    }

    return new ApiError({
      status: error.response?.status || 500,
      message: error.message || "Помилка з'єднання з сервером",
    });
  }
}
