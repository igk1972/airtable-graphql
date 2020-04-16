const sanitize = require("./sanitize");

const TTL_MS = 60 * 1000; // 1 minutes

// Takes an airtable schema and returns GraphQL resolvers.
module.exports = (airtableSchema, api, columnSupport, cache) => {
  const getRecordCacheKey = (table, id) => {
    return `${table.name}:${id}`;
  }

  const getTableCacheKey = (table) => {
    return `FullTable:${table.name}`;
  }

  const fetchRecordFromApi = (api, table, id) =>
    new Promise((resolve, reject) => {
      api(table).find(id, (err, record) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(record);
      });
    });

  const fetchAllRecordsForTable = (table, api) =>
    new Promise((resolve, reject) => {
      let results = [];
      api(table.name)
        .select()
        .eachPage(
          (records, nextPage) => {
            results = [...results, ...records];
            nextPage();
          },
          err => {
            resolve(results);
          }
        );
    });

  const fetchRecord = async (api, table, id) => {
    const cacheKey = getRecordCacheKey(table, id)
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await fetchRecordFromApi(api, table, id);
    if (result) {
      await cache.put(cacheKey, result, TTL_MS);
    }
    return result;
  }

  const resolversForTable = (table, api) => {
    const columnResolvers = table.columns.reduce((resolvers, column) => {
      let columnBuilder = columnSupport[column.type];
      if (!columnBuilder || !columnBuilder.resolver) {
        columnBuilder = columnSupport['text']
      }
      resolvers[sanitize.toField(column.name)] = columnBuilder.resolver(column, api);
      return resolvers;
    }, {});

    if (!columnResolvers.id) {
      columnResolvers.id = obj => obj.id;
    }

    return columnResolvers;
  };

  const resolverForAll = (table, api) => async () => {
    const cacheKey = getTableCacheKey(table);
    const cachedResults = await cache.get(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }
    const results = await fetchAllRecordsForTable(table, api);
    await cache.put(cacheKey, results, TTL_MS);
    return results;
  }

  const resolverForSingle = (table, api) => (_, args) => {
    return fetchRecord(api, table.name, args.id);
  };
  const resolvers = {
    Query: {}
  };

  resolvers.Query.tables = () => {
    return airtableSchema.tables.map(t => t.name);
  };

  airtableSchema.tables.forEach(table => {
    const all = sanitize.plural(sanitize.toField(table.name));
    resolvers.Query[all] = resolverForAll(table, api);

    const single = sanitize.singular(sanitize.toField(table.name));
    resolvers.Query[single] = resolverForSingle(table, api);

    const typeName = sanitize.toType(table.name);
    resolvers[typeName] = resolversForTable(table, api);
  });

  return resolvers;
};
