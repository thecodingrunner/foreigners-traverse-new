/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Page($slug: String!, $locale: I18NLocaleCode) {\n    pages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      title\n      sections {\n        __typename\n        ... on ComponentSectionsHero {\n          heading\n          introduction\n          subheading\n        }\n        ... on ComponentSectionsFeaturedStages {\n          heading\n        }\n      }\n    }\n  }\n": typeof types.PageDocument,
    "\n  query Stages($locale: I18NLocaleCode, $sort: [String], $limit: Int, $filters: StageFiltersInput) {\n    stages(locale: $locale, sort: $sort, pagination: { limit: $limit }, filters: $filters) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      startName\n      endName\n      featured\n      stats { distanceKm elevationGainM }\n      coverImage { url alternativeText width height }\n      prefectures { code nameEn nameJa }\n    }\n  }\n": typeof types.StagesDocument,
    "\n  query Stage($slug: String!, $locale: I18NLocaleCode) {\n    stages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      body\n      startName\n      endName\n      routeFile\n      gpxFile { url }\n      stats {\n        distanceKm elevationGainM elevationLossM\n        movingTimeMin weather tempC sleptAt\n      }\n      coverImage { url alternativeText width height }\n      gallery { caption alt image { url alternativeText width height } }\n      prefectures { code nameEn nameJa region }\n      seo { metaTitle metaDescription ogImage { url width height } }\n    }\n  }\n": typeof types.StageDocument,
    "\n  query RideTotals {\n    stages(pagination: { limit: 100 }) {\n      stats { distanceKm elevationGainM }\n    }\n  }\n": typeof types.RideTotalsDocument,
};
const documents: Documents = {
    "\n  query Page($slug: String!, $locale: I18NLocaleCode) {\n    pages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      title\n      sections {\n        __typename\n        ... on ComponentSectionsHero {\n          heading\n          introduction\n          subheading\n        }\n        ... on ComponentSectionsFeaturedStages {\n          heading\n        }\n      }\n    }\n  }\n": types.PageDocument,
    "\n  query Stages($locale: I18NLocaleCode, $sort: [String], $limit: Int, $filters: StageFiltersInput) {\n    stages(locale: $locale, sort: $sort, pagination: { limit: $limit }, filters: $filters) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      startName\n      endName\n      featured\n      stats { distanceKm elevationGainM }\n      coverImage { url alternativeText width height }\n      prefectures { code nameEn nameJa }\n    }\n  }\n": types.StagesDocument,
    "\n  query Stage($slug: String!, $locale: I18NLocaleCode) {\n    stages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      body\n      startName\n      endName\n      routeFile\n      gpxFile { url }\n      stats {\n        distanceKm elevationGainM elevationLossM\n        movingTimeMin weather tempC sleptAt\n      }\n      coverImage { url alternativeText width height }\n      gallery { caption alt image { url alternativeText width height } }\n      prefectures { code nameEn nameJa region }\n      seo { metaTitle metaDescription ogImage { url width height } }\n    }\n  }\n": types.StageDocument,
    "\n  query RideTotals {\n    stages(pagination: { limit: 100 }) {\n      stats { distanceKm elevationGainM }\n    }\n  }\n": types.RideTotalsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Page($slug: String!, $locale: I18NLocaleCode) {\n    pages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      title\n      sections {\n        __typename\n        ... on ComponentSectionsHero {\n          heading\n          introduction\n          subheading\n        }\n        ... on ComponentSectionsFeaturedStages {\n          heading\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Page($slug: String!, $locale: I18NLocaleCode) {\n    pages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      title\n      sections {\n        __typename\n        ... on ComponentSectionsHero {\n          heading\n          introduction\n          subheading\n        }\n        ... on ComponentSectionsFeaturedStages {\n          heading\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Stages($locale: I18NLocaleCode, $sort: [String], $limit: Int, $filters: StageFiltersInput) {\n    stages(locale: $locale, sort: $sort, pagination: { limit: $limit }, filters: $filters) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      startName\n      endName\n      featured\n      stats { distanceKm elevationGainM }\n      coverImage { url alternativeText width height }\n      prefectures { code nameEn nameJa }\n    }\n  }\n"): (typeof documents)["\n  query Stages($locale: I18NLocaleCode, $sort: [String], $limit: Int, $filters: StageFiltersInput) {\n    stages(locale: $locale, sort: $sort, pagination: { limit: $limit }, filters: $filters) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      startName\n      endName\n      featured\n      stats { distanceKm elevationGainM }\n      coverImage { url alternativeText width height }\n      prefectures { code nameEn nameJa }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Stage($slug: String!, $locale: I18NLocaleCode) {\n    stages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      body\n      startName\n      endName\n      routeFile\n      gpxFile { url }\n      stats {\n        distanceKm elevationGainM elevationLossM\n        movingTimeMin weather tempC sleptAt\n      }\n      coverImage { url alternativeText width height }\n      gallery { caption alt image { url alternativeText width height } }\n      prefectures { code nameEn nameJa region }\n      seo { metaTitle metaDescription ogImage { url width height } }\n    }\n  }\n"): (typeof documents)["\n  query Stage($slug: String!, $locale: I18NLocaleCode) {\n    stages(filters: { slug: { eq: $slug } }, locale: $locale) {\n      documentId\n      slug\n      stageNumber\n      date\n      title\n      excerpt\n      body\n      startName\n      endName\n      routeFile\n      gpxFile { url }\n      stats {\n        distanceKm elevationGainM elevationLossM\n        movingTimeMin weather tempC sleptAt\n      }\n      coverImage { url alternativeText width height }\n      gallery { caption alt image { url alternativeText width height } }\n      prefectures { code nameEn nameJa region }\n      seo { metaTitle metaDescription ogImage { url width height } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RideTotals {\n    stages(pagination: { limit: 100 }) {\n      stats { distanceKm elevationGainM }\n    }\n  }\n"): (typeof documents)["\n  query RideTotals {\n    stages(pagination: { limit: 100 }) {\n      stats { distanceKm elevationGainM }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;