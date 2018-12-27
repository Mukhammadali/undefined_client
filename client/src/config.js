const config = {
  GRAPHQL_ENDPOINT: 'http://localhost:4000/graphql',
  cookieExpDays: 7,
};

if (process.env.NODE_ENV === 'production') {
  config.GRAPHQL_ENDPOINT = 'https://www.app.imagoapp.co.kr/graphql';
}

export default config;
