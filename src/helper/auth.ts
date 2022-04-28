import { Request } from 'express';

export function getAuthHeader(request: Request): string | undefined {
  if (
    request.headers.authorization &&
    request.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return request.headers.authorization.split(' ')[1];
  } else if (request.query && request.query.token) {
    return request.query.token as string;
  }

  return undefined;
}
