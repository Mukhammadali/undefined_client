import { resetToken, setToken, getToken } from '../lib/utils/authUtils';
import { unsubscribeApollo } from '../ApolloClient';

const resolvers = {
  Mutation: {
    clientLogIn: async (_, data, { cache }) => {
      await setToken(data.token);
      cache.writeData({ data: { loggedIn: true } });
      return null;
    },
    clientLogOut: async (_, data, { cache }) => {
      // await cache.resetStore();
      await resetToken();
      // const token = await getToken();
      // console.log('token', token);
      // if (!token) {
      //   await cache.writeData({ data: { loggedIn: false } });
      // }
      await document.location.reload();
      return null;
    },
  }
};

export default resolvers;
