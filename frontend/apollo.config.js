module.exports = {
  client: {
    service: {
      name: 'prose-api-schema',
      localSchemaFile: '../api/src/generated/schema.graphql',
    },
    excludes: ['**/generated/**/*'],
  },
};
