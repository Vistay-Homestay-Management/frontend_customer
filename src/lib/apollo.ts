import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { runtimeConfig } from './runtimeConfig'

const httpLink = new HttpLink({
  uri: runtimeConfig.graphqlUrl || import.meta.env.VITE_GRAPHQL_URL || '/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('vistay.accessToken')
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  }))
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
