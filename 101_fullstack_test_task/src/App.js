import React from "react";
import "fontsource-roboto";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import MainBar from "./Components/MainBar";
import Page from "./Components/Page";
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const httpLink = new HttpLink({
  uri: "https://stage.gql.101internet.ru",
  headers: {Authorization: "Basic MTAxaW50ZXI6dGVzdDEwMQ=="},
  connectToDevTools: true
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
  if (networkError) console.error(`[Network error]: ${JSON.stringify(networkError, null, 2)})`)
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <MainBar />
      <Page />
    </ApolloProvider>
  );
}

export default App;
