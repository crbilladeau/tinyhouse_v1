require('dotenv').config();

import express, {Application} from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './database';
import { typeDefs, resolvers } from './graphql';
// import bodyParser from 'body-parser';
// import { listings } from './listings';


// RESTful IMPLEMENTATION
// const app = express();
// app.use(bodyParser.json());

// //listings
// app.get('/listings', (_req, res) => {
//   return res.send({listings});
// });

// //delete-listing
// app.post('/deelte-listing', (req, res) => {
//   const id: string = req.body.id;

//   for (let i = 0; i < listings.length; i++) {
//     if (listings[i].id === id) {
//       return res.send(listings.splice(i, 1));
//     }
//   }

//   return res.send('failed to delete listing');
// });

// app: Application is the type of the express app instance
const mount = async (app: Application) => {
  // connect to mongodb database
  const db = await connectDatabase();
  // Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ db }) });
  server.applyMiddleware({ app, path: '/api' });

  app.listen(process.env.PORT);

  console.log(`[app]: http://localhost:${process.env.PORT}`);
  // const listings = await db.listings.find({}).toArray();
  // console.log(listings);
}

// the parent function to run our server with express app & mongodb
mount(express());
