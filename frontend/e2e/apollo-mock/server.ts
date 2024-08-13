import fs from 'fs';
import path from 'path';
import http from 'http';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';

import { MOCK_SERVER_PORT } from '../global';

import {
  loginResolvers,
  topicResolvers,
  categoriesResolvers,
  queriesResolvers,
  mutationsResolvers,
  messageResolvers,
  profileResolvers,
  siteResolvers,
  userResolvers,
  pollResolvers,
  userStatusResolvers,
  userActivityResolvers,
} from './resolvers';

export type MockServerContext = {
  server: ApolloServer;
  stop: () => void;
};
export type ContextValue = {
  token?: string;
};

/**
 * The mocked `schema.graphql` is automatically generated after running yarn `graphql:generate` or `yarn mock:generate`.
 * Before using these two commands, you must first run `yarn generate` from the API directory.
 */

const pathDir = path.dirname(__filename);

const pathSchema = path.join(pathDir, 'generated', 'schema.graphql');

const typeSchema = fs.readFileSync(pathSchema, 'utf8');

export async function startMockServer(): Promise<MockServerContext> {
  const schema = makeExecutableSchema({
    typeDefs: [typeSchema],
    resolvers: [
      loginResolvers,
      topicResolvers,
      categoriesResolvers,
      queriesResolvers,
      mutationsResolvers,
      messageResolvers,
      profileResolvers,
      siteResolvers,
      userResolvers,
      pollResolvers,
      userStatusResolvers,
      userActivityResolvers,
    ],
  });

  const app = express();
  app.use('/images/emoji/twitter', express.static(__dirname + '/assets'));
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return { token: JSON.stringify(req.headers.authorization) };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app, path: '/' });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: MOCK_SERVER_PORT }, resolve),
  );

  return {
    server,
    stop: async () => {
      await server.stop();
      httpServer.close();
    },
  };
}
