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
      setTimeout(cache.writeData({ data: { loggedIn: false } }), 3000)
      return null;
    },
  }
};

export default resolvers;
