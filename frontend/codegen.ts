import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/src/generated',
  documents: ['src/graphql/server/*.{ts,tsx}'],
  config: {
    namingConvention: {
      fileName: 'change-case-all#pascalCase',
    },
  },
  generates: {
    './src/generated/server.ts': {
      config: {
        withHooks: true,
        dedupeOperationSuffix: true,
      },
      plugins: [
        {
          add: {
            content: '// THIS FILE IS GENERATED, DO NOT EDIT!',
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
  hooks: {
    afterAllFileWrite: [`prettier --write "src/generated/**/*.{ts,tsx}"`],
  },
};

export default config;
