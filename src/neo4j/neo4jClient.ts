import { NEO4J_CONFIGS } from '../configuration/configuration';
import neo4j, { QueryResult } from 'neo4j-driver';

const neo4jDriver = neo4j.driver(
  `bolt://${NEO4J_CONFIGS.NEO4J_HOST}:${NEO4J_CONFIGS.NEO4J_PORT}`,
  neo4j.auth.basic(NEO4J_CONFIGS.NEO4J_USER, NEO4J_CONFIGS.NEO4J_PASS),
);

export const readTransaction = (query: string): Promise<QueryResult> => {
  const session = neo4jDriver.session();
  return session
    .readTransaction((txc) => txc.run(query))
    .then((res) => {
      session.close();
      return res;
    });
};

export const writeTransaction = (query: string): Promise<QueryResult> => {
  const session = neo4jDriver.session();
  return session
    .writeTransaction((txc) => txc.run(query))
    .then((res) => {
      session.close();
      return res;
    });
};

export interface Neo4jNode {
  labels?: string[];
  properties?: Properties;
}

export interface Neo4jEdge {
  type?: string;
  properties?: Properties;
  fromId: AlphaNumeric;
  toId: AlphaNumeric;
}

export type Properties = Record<string, AlphaNumeric>;
