import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/settings.env` });

export const postgresCredentials = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: process.env.POSTGRES_HOSTNAME!,
};

export const accessToken = process.env.TOKEN!;
