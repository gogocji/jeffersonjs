import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
// fix apollo bug:Uncaught (in promise) DOMException: The user aborted a request. from: https://github.com/apollographql/apollo-client/issues/6769

const abortController = new AbortController();

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
  fetchOptions: {
    mode: "cors",
    signal: abortController.signal,
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ networkError }) => {
  if (!networkError) {
    return;
  }
});

const graphQLClient = new ApolloClient({
  link: authLink.concat(errorLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

export default graphQLClient;