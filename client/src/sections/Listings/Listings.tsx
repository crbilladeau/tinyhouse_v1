import React, { useState, useEffect } from 'react';
import { server } from '../../lib/api';
import { Listing, DeleteListingData, DeleteListingVariables, ListingsData } from './types';

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
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);


  const fetchListings = async () => {
    // fetch expects a body argument which contains a query field of the query intended to be fetched; the query defines the shape of the data to be returned from the api
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    setListings(data.listings);
  }

  const deleteListing = async (id: string) => {
    // data type helps define the shpae of data being returned and the data variables type helps constrict the shape of variables the request expects
    await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });
    fetchListings();
  };

  const listingsList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>{listing.title}
            <button onClick={() => deleteListing(listing.id)}>
              Delete
            </button>
          </li>
        );
      })}
    </ul> 
  ) : null;

  return (
    <div>
      <h2>
        {title}
      </h2>
      {listingsList}
    </div>
  )
}