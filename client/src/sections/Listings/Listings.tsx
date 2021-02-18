import React from 'react';
import { server } from '../../lib/api';
import { DeleteListingData, DeleteListingVariables, ListingsData } from './types';

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
      numOfBaths
      rating
    }
  }
`;

// delete listing mutation
const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string
}

export const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    // fetch expects a body argument which contains a query field of the query intended to be fetched; the query defines the shape of the data to be returned from the api
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log(data);
  }

  const deleteListing = async () => {
    // data type helps define the shpae of data being returned and the data variables type helps constrict the shape of variables the request expects
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "6021fc7971fc47267406901f", // hardcoded id variable
      }
    });
    console.log(data);
  };

  return (
    <div>
      <h2>
        {title}
      </h2>
      <button onClick={fetchListings}>
        Query Listings
      </button>
      <button onClick={deleteListing}>
        Delete a Listing
      </button>
    </div>
  )
}