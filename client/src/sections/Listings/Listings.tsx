import React from 'react';
import { server } from '../../lib/api';

// listings query
const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      rating
    }
  }
`;

interface Props {
  title: string
}

export const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    // fetch expects a body argument which contains a query field of the query intended to be fetched; the query defines the shape of the data to be returned from the api
    const { data } = await server.fetch({ query: LISTINGS });
    console.log(data);
  }
  return (
    <div>
      <h2>
        {title}
      </h2>
      <button onClick={fetchListings}>
        Query Listings
      </button>
    </div>
  )
}