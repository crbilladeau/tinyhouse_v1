require('dotenv').config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';

// app: Application is the type of the express app instance
const mount = async (app: Application) => {
  // connect to mongodb database
  const db = await connectDatabase();
  // create new Apollo Server instance
  const server = new ApolloServer({
    // Apollo Server needs the typeDefs and resolvers and the database passed in as context
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  // Connects Apollo Server to the HTTP framework of a Node.js middleware library, such as hapi or express
  server.applyMiddleware({ app, path: '/api' });

  app.listen(process.env.PORT);

  console.log(`[app]: http://localhost:${process.env.PORT}`);
};

// the parent function to run our server with express app & mongodb
mount(express());
