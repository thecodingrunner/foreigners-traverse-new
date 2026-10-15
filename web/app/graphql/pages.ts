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
        ... on ComponentSectionsFeaturedStages {
          heading
        }
        ... on ComponentSectionsExploreCta {
          heading
        }
        ... on ComponentSectionsAboutHero {
          link {
            href
            text
          }
          body
          cvFile {
            url
            alternativeText
          }
          image {
            alternativeText
            url
            height
            width
            formats
          }
          imageCaption
          label
          title
          titleAlt
        }
      }
      seo {
        metaDescription
        metaTitle
        ogImage {
          alternativeText
          url
          caption
        }
      }
    }
  }
`);
