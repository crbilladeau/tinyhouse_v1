import { Collection, ObjectId } from 'mongodb';

// enums are used to define a  known set of named constants
export enum ListingType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export interface Booking {
  _id: ObjectId;
  // 1-1 relationship where the booking references the listing
  listing: ObjectId;
  // 1-1 relationship where the booking references the user
  tenant: string;
  // will store bookings date information in string format
  checkIn: string;
  checkOut: string;
}

export interface Listing {
  // id field is unique in mongodb; has unique type because it is the primary key for a document in a collection
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  // 1-1 relationship where the listing references the user
  host: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  // an array of objectIds that refer to an document in our bookings collection
  bookings: ObjectId[];
  // an object of year objects that contain month objects that contain values of booleans for booked days of the months (see interfaces above)
  bookingsIndex: BookingsIndex;
  price: number;
  numOfGuests: number;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: ObjectId[];
  listings: ObjectId[];
}

export interface Database {
  // add the <Listing> interface as the type parameter of the <Collection> interface, which is the type of the listings field
  listings: Collection<Listing>;
  users: Collection<User>;
  bookings: Collection<Booking>;
}
