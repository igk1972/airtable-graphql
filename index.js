const convertSchema = require('./convertSchema');
const createResolvers = require('./createResolvers');
const airtable = require('airtable');
const fs = require('fs');

class AirtableGraphQL {
  constructor(apiKey, config = {}) {
    this.columns = {};
    airtable.configure({ apiKey });
    const schema = JSON.parse(
      fs.readFileSync(config.schemaPath || './schema.json', 'utf8'),
    );

    var normalizedPath = require('path').join(__dirname, 'columns');
    require('fs')
      .readdirSync(normalizedPath)
      .forEach(file => {
        require('./columns/' + file)(this);
      });

    this.api = airtable.base(schema.id);
    this.schema = convertSchema(schema, this.columns);

    this.resolvers = createResolvers(schema, this.api, this.columns);
  }

  addColumnSupport(columnType, config) {
    this.columns = {
      ...this.columns,
      [columnType]: config,
    };
  }
}

module.exports = AirtableGraphQL;
