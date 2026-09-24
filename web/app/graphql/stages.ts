// app/graphql/pages.ts
import { graphql } from "~/gql";

export const StagesQuery = graphql(`
  query Stages($locale: I18NLocaleCode, $sort: [String], $limit: Int) {
    stages(locale: $locale, sort: $sort, pagination: { limit: $limit }) {
      documentId
      slug
      stageNumber
      date
      title
      excerpt
      startName
      endName
      featured
      stats { distanceKm elevationGainM }
      coverImage { url alternativeText width height }
      prefectures { code nameEn nameJa }
    }
  }
`);

export const StageQuery = graphql(`
  query Stage($slug: String!, $locale: I18NLocaleCode) {
    stages(filters: { slug: { eq: $slug } }, locale: $locale) {
      documentId
      slug
      stageNumber
      date
      title
      excerpt
      body
      startName
      endName
      routeFile
      gpxFile { url }
      stats {
        distanceKm elevationGainM elevationLossM
        movingTimeMin weather tempC sleptAt
      }
      coverImage { url alternativeText width height }
      gallery { caption alt image { url alternativeText width height } }
      prefectures { code nameEn nameJa region }
      seo { metaTitle metaDescription ogImage { url width height } }
    }
  }
`);