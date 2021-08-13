import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// imported Apollo Provider packages
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//create new Apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // wrapped Apollo provider around our app components and reference client
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            {/* reformatted page requests */}
            <Route exact path="/">
              <SearchBooks />
            </Route>
            <Route exact path="/saved">
              <SavedBooks />
            </Route>
            <Route
              render={() => <h1 className="display-2">Wrong page!</h1>}
            ></Route>
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
