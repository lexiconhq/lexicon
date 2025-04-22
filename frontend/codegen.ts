import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  config: {
    namingConvention: {
      fileName: 'change-case-all#pascalCase',
    },
  },
  generates: {
    './src/generatedAPI/server.ts': {
      schema: 'src/api/discourse-apollo-rest/schema.graphql',
      documents: ['src/api/discourse-apollo-rest/*.{ts,tsx}'],
      config: {
        withHooks: true,
        dedupeOperationSuffix: true,
        scalars: {
          BodyBuilder: 'unknown',
          PathBuilder: 'unknown',
          DeleteEmailOutput: 'string',
          ChangePasswordOutput: 'string',
          MarkReadChatOutput: 'string',
          SetPrimaryEmailOutput: 'string',
          DeletePostDraftOutput: 'string',
          File: 'ReactNativeFile',
        },
      },
      plugins: [
        {
          add: {
            /**
             * Defines the ReactNativeFile type for file uploads.
             */
            content: `
              export type ReactNativeFile = {
                uri: string;
                type?: string;
                name?: string;
              };
            `,
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
  hooks: {
    afterAllFileWrite: [`prettier --write "src/generatedAPI/**/*.{ts,tsx}"`],
  },
};

export default config;
