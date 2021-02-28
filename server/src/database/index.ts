import { MongoClient } from 'mongodb';
import { Database, Booking, Listing, User } from '../lib/types';

// utilizes connect function from mongoclient, takes in a url as an argument to specify a connection to the mongodb instance
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/<dbname>?retryWrites=true&w=majority`;

// returns a Promise with an object of type <Database>
export const connectDatabase = async (): Promise<Database> => {
  // connect to mongodb instance
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // access the database in the cluster
  const db = client.db('main');

  // return an object that contains a reference to the listings database
  return {
    // access the collections from the db variable
    bookings: db.collection<Booking>('bookings'),
    listings: db.collection<Listing>('listings'),
    users: db.collection<User>('users'),
  };
};
