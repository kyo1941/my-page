export class UnauthorizedError extends Error {
  name = "UnauthorizedError";
}

export class NotFoundError extends Error {
  name = "NotFoundError";
}

export class ApiError extends Error {
  name = "ApiError";
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

