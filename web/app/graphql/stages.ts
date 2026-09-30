// app/graphql/pages.ts
import { graphql } from "~/gql";

export const StagesQuery = graphql(`
  query Stages(
    $locale: I18NLocaleCode
    $sort: [String]
    $page: Int
    $pageSize: Int
    $filters: StageFiltersInput
  ) {
    stages_connection(
      locale: $locale
      sort: $sort
      pagination: { page: $page, pageSize: $pageSize }
      filters: $filters
    ) {
      nodes {
        documentId
        slug
        stageNumber
        date
        title
        excerpt
        startNameEn
        endNameEn
        startNameJa
        endNameJa
        featured
        routePreview
        stats {
          distanceKm
          elevationGainM
          movingTimeMin
        }
        coverImage {
          url
          alternativeText
          width
          height
        }
        prefectures {
          code
          nameEn
          nameJa
          region
        }
      }
      pageInfo {
        page
        pageSize
        pageCount
        total
      }
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
      startNameEn
      endNameEn
      startNameJa
      endNameJa
      routeFile
      routePreview
      gpxFile {
        url
      }
      stats {
        distanceKm
        elevationGainM
        elevationLossM
        movingTimeMin
        weather
        tempC
        sleptAt
      }
      coverImage {
        url
        alternativeText
        width
        height
      }
      gallery {
        caption
        alt
        image {
          url
          alternativeText
          width
          height
        }
      }
      prefectures {
        code
        nameEn
        nameJa
        region
      }
      seo {
        metaTitle
        metaDescription
        ogImage {
          url
          width
          height
        }
      }
    }
  }
`);

export const RideTotalsQuery = graphql(`
  query RideTotals {
    stages(pagination: { limit: 100 }) {
      stats {
        distanceKm
        elevationGainM
      }
      prefectures {
        code
        nameEn
        nameJa
      }
    }
  }
`);

export const AdjacentStagesQuery = graphql(`
  query AdjacentStages($numbers: [Int], $locale: I18NLocaleCode) {
    stages(filters: { stageNumber: { in: $numbers } }, locale: $locale) {
      slug
      stageNumber
      title
      startNameEn
      startNameJa
      endNameEn
      endNameJa
    }
  }
`);
