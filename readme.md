# Airtable GraphQL

# Setup

```
npm install airtable-graphql --save
```

Pull your airtable schema by running the `airtable-graphql pull` command in the root folder of your project.

```
$ airtable-graphql pull --email=[your_email] --password=[your_password] --base=[base_id]
```

This will create a `schema.json` file which describes all of your bases tables and columns.

Use the `airtable-graphql start` command to start the adapter

$ AIRTABLE_API_KEY={{api_key}} airtable-graphql start -s schema.json -p 8765

or

```js
// Embedding in an express app
import express from 'express';
import { printSchmea } from 'graphql';
import { ApolloServer } from 'apollo-server-express';

const AirtableGraphQL = require('airtable-graphql');
const airtableGraphql = new AirtableGraphQL('airtable_api_key');

const server = new ApolloServer({
  typeDefs: printSchmea(airtableSchema.schema),
  resolvders: airtableSchema.resolvers,
});
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:8765${server.graphqlPath}`),
);
```

Open your browser to localhost:8765 to start writing GraphQL queries against your Airtable data.

That's it!
