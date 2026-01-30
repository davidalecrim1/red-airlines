import { createClient, cacheExchange, fetchExchange } from 'urql';

export const client = createClient({
  url: 'http://localhost:8080/query',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  preferGetMethod: false,
});
