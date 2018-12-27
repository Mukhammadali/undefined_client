import { resetToken, setToken } from '../lib/utils/authUtils';

const resolvers = {
  Mutation: {
    clientLogIn: async (_, data, { cache }) => {
      await setToken(data.token);
      cache.writeData({ data: { loggedIn: true } });
      return null;
    },
    clientLogOut: async (_, data, { cache }) => {
      await resetToken();
      cache.writeData({ data: { loggedIn: false } });
      return null;
    },
  }
};

export default resolvers;
