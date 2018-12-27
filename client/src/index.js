import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import client from './ApolloClient';
import * as serviceWorker from './serviceWorker';

const render = Component => {
  ReactDOM.render(
      <ApolloProvider client={client}>
        <Component />
      </ApolloProvider>,
    document.getElementById('root')
  );
};

render(App);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
