import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
  JWT_SECRET_TOKEN_ExpiresIn: process.env.JWT_SECRET_TOKEN_ExpiresIn
};
