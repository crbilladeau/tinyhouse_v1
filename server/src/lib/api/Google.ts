import { google } from 'googleapis';

// new google OAuth instance with the gClientID and gClientSecret
const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

// generate a url that asks permissions for user email and profile

export const Google = {
  authUrl: auth.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }),
  logIn: async (code: string) => {
    // get the user's auth token
    const { tokens } = await auth.getToken(code);

    // set the credentials to the user's returned auth token
    auth.setCredentials(tokens);

    // make a request to google's people api to get the user info
    const { data } = await google.people({ version: 'v1', auth }).people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });

    // returns an object with a user property containing the retrieved data
    return { user: data };
  },
};
