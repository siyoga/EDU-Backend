import { Request } from 'express';

import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/settings.env` });

export const destinationPath = `${__dirname}/public`;
export const accessToken = process.env.TOKEN_SECRET!;
export const postgresConfig = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: process.env.POSTGRES_HOSTNAME!,
};
