import React from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, List, Avatar, Button, Spin } from 'antd';
import { Listings as ListingsData } from './__generated__/Listings';
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';
import { ListingsSkeleton } from './components';
import './styles/Listings.css';

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
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { loading, error, data, refetch } = useQuery<ListingsData>(LISTINGS);

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

  // listings element
  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List 
      itemLayout="horizontal" 
      dataSource={listings} 
      renderItem={listing => (
        <List.Item actions={
          [<Button 
            type="primary"
            danger
            onClick={() => handleDeleteListing(listing.id)}>Delete</Button>]}>
          <List.Item.Meta 
            title={listing.title} 
            description={listing.address} 
            avatar={
              <Avatar 
                src={listing.image} 
                shape="square" 
                size={48}
              />
            }
          />
        </List.Item>
      )}
    />
  ) : null;
  
  if (loading) {
    return (
    <div className="listings">
      <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ListingsSkeleton title={title} error />
      </div>
    )
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert 
      type="error"
      message="Uh oh! Something went wrong - please try again later."
      className="listings__alert"
    />
  ) : null;

  return (
    <div className="listings">
      {deleteListingErrorAlert}
      <h2>
        {title}
      </h2>
      {listingsList}
      <Spin spinning={deleteListingLoading} />
    </div>
  )
}