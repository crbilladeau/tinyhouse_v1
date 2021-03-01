import { gql } from 'apollo-server-express';

// graphql schema for OAuth for "Viewer"
// didRequest tells whether we've already attempted to obtain the Viewer's info
export const typeDefs = gql`
  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  input LogInInput {
    code: String!
  }

  type Query {
    authUrl: String!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
// logIn & logOut will return a Viewer instance when successful
