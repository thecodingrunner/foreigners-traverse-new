import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: [
        {
            [process.env.STRAPI_GRAPHQL_URL!]: {
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                }
            }
        }
    ],
    documents: ["app/**/*.{ts,tsx}"],
    ignoreNoDocuments: true,
    generates: {
        "app/gql/": { preset: "client", config: { useTypeImports: true } }
    },
};

export default config;