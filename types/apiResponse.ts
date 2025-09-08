interface APIResponse<T> {
  code: number;
  message: string;
  data?: T;
  errors?: ErrorInfo[];
}

interface ErrorInfo {
  field: string;
  reason: string;
}

export default APIResponse