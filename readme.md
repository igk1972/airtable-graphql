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

Create a file called `index.js` and add the following.

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
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
```

Run `node index.js`

That's it!
