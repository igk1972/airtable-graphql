const graphql = require('graphql');

module.exports = airtableGraphql => {
  airtableGraphql.addColumnSupport("id", {
    // graphqlType is a function that takes the column configuration and returns
    // a valid graphql field type.
    graphqlType: column => ({
      type: graphql.GraphQLID
    }),
    // reolver is a function that takes the column configuration object and an
    // instance of the airtable node API and returns a graphql resolver.
    resolver: () => obj => {
      return obj.id
    } 
  })
}
