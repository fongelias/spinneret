import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
  throw Error('Please specify a PORT in your .env');
}

export const SERVER_CONFIGS = {
  PORT: process.env.PORT
}

if (
  !process.env.NEO4J_HOST ||
  !process.env.NEO4J_PORT ||
  !process.env.NEO4J_USER ||
  !process.env.NEO4J_PASS
) {
  throw Error('Neo4j Variables Do Not Exist');
}

export const NEO4J_CONFIGS: Record<string, string> = {
  NEO4J_HOST: process.env.NEO4J_HOST,
  NEO4J_PORT: process.env.NEO4J_PORT,
  NEO4J_USER: process.env.NEO4J_USER,
  NEO4J_PASS: process.env.NEO4J_PASS,
};