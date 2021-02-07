import { Collection, ObjectId } from 'mongodb';

export interface Listing {
  // id field is unique in mongodb; has unique type because it is the primary key for a document in a collection
  _id: ObjectId;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export interface Database {
  // add the <Listing> interface as the type parameter of the <Collection> interface, which is the type of the listings field
  listings: Collection<Listing>;
}