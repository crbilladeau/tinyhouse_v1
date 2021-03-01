import crypto from 'crypto';
import { IResolvers } from 'apollo-server-express';
import { Google } from '../../../lib/api';
import { Viewer, Database, User } from '../../../lib/types';
import { LogInArgs } from './types';

// when resolved successfully, it returns a User document from the user's collection for the user that just signed in; if unsuccessful, return undefined
const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database
): Promise<User | undefined> => {
  // logIn function and receive user data
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error('Google login error');
  }

  // get list of User names, photos, emails
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // User display name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User id
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  // if none of the user's info is available, throw error
  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error('Google login error');
  }
  // check if user exists in the database and then update it to the latest info from Google
  const updateRes = await db.users.findOneAndUpdate(
    // selects the first document in the mongodb db that matches this parameter (the filter object, { _id: userId })
    { _id: userId },
    // update object: specifies how to update the selected document
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    // return the updated document
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  // if updated viewer, then insert updated viewer into the mongodb db
  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });
    // first user can be accessed with the ops array
    viewer = insertResult.ops[0];
  }
  return viewer;
};

// resolvers for "Viewer" i.e OAuth
export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    // db is available as context in the resolver functions
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database }
    ) => {
      try {
        const code = input ? input.code : null;
        // create a random token every time a user is logged in which is returned to the client application
        const token = crypto.randomBytes(16).toString('hex');

        // call logInViaGoogle function and pass in the code input, token, and database values
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;
        // if no viewer, then we return didRequest as true to confirm that a request was made
        if (!viewer) {
          return { didRequest: true };
        }

        // if there is a valid viewer, then return all the information for the Viewer
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: (): Viewer => {
      try {
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};
