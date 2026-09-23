import { GraphQLClient } from "graphql-request";

export const strapi = new GraphQLClient(process.env.STRAPI_GRAPHQL_URL!, {
    headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
});