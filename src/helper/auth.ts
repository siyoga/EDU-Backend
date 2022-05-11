import jwt from 'jsonwebtoken';
import { Request } from 'express';

import { accessToken } from '../../config';
import { ICryptToken } from '../typings';

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

export function decodeToken(userId: string): string {
  const decodedUserId = jwt.verify(userId, accessToken) as ICryptToken;
  return decodedUserId.userId;
}
