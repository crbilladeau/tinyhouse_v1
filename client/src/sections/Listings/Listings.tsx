import React from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { Listings as ListingsData } from './__generated__/Listings';
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';

// listings query
// NOTE: we must name queries and mutations in order for apollo codegen to work
const LISTINGS = gql`
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
const DELETE_LISTING = gql`
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
  const { data, loading, error, refetch  } = useQuery<ListingsData>(LISTINGS);

  const [deleteListing, 
    { 
      loading: deleteListingLoading, 
      error: deleteListingError 
    }
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    // data type helps define the shpae of data being returned and the data variables type helps constrict the shape of variables the request expects
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>{listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>
              Delete
            </button>
          </li>
        );
      })}
    </ul> 
  ) : null;
  
  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later</h2>
  }

  const deleteListingLoadingMessage = deleteListingLoading? <h4>Deletion in progress...</h4> : null;

  const deleteListingErrorMessage = deleteListingError? <h4>Uh oh! Something went wrong with delting - please try again later</h4> : null;

  return (
    <div>
      <h2>
        {title}
      </h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  )
}