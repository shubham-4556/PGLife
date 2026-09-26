export class AppError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.fields = fields;
  }

  static badRequest(message: string, fields?: Record<string, string>): AppError {
    return new AppError(400, message, fields);
  }

  static unauthorized(message = "You need to be logged in to do that"): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = "You do not have access to that"): AppError {
    return new AppError(403, message);
  }

  static notFound(message = "Not found"): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string, fields?: Record<string, string>): AppError {
    return new AppError(409, message, fields);
  }
}
