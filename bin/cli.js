#! /usr/bin/env node
const { printSchema } = require('graphql');
const fs = require('fs');
const fetchSchema = require('../fetchSchema');
const program = require('commander');

const AirtableGraphQL = require('../index');

program
  .command('pull')
  .option('-b --base [id]')
  .option('-e --email [email]')
  .option('-p --password [password]')
  .action(function(cmd) {
    fetchSchema({
      base: cmd.base,
      email: cmd.email,
      password: cmd.password,
    }).then(schema => {
      fs.writeFileSync(
        './schema.json',
        JSON.stringify(schema, null, 2),
        'utf-8',
      );
      const airtableGraphql = new AirtableGraphQL('not_used');
      fs.writeFileSync(
        './schema.gql',
        printSchema(airtableGraphql.schema),
        'utf-8',
      );
    });
  });

program.parse(process.argv);
