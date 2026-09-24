// app/graphql/pages.ts
import { graphql } from "~/gql";

export const PageQuery = graphql(`
  query Page($slug: String!, $locale: I18NLocaleCode) {
    pages(filters: { slug: { eq: $slug } }, locale: $locale) {
      title
      sections {
        __typename
        ... on ComponentSectionsHero {
          heading
          introduction
          subheading
        }
      }
    }
  }
`);