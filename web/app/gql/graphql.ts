/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BooleanFilterInput = {
  and?: Array<boolean | null | undefined> | null | undefined;
  between?: Array<boolean | null | undefined> | null | undefined;
  contains?: boolean | null | undefined;
  containsi?: boolean | null | undefined;
  endsWith?: boolean | null | undefined;
  eq?: boolean | null | undefined;
  eqi?: boolean | null | undefined;
  gt?: boolean | null | undefined;
  gte?: boolean | null | undefined;
  in?: Array<boolean | null | undefined> | null | undefined;
  lt?: boolean | null | undefined;
  lte?: boolean | null | undefined;
  ne?: boolean | null | undefined;
  nei?: boolean | null | undefined;
  not?: BooleanFilterInput | null | undefined;
  notContains?: boolean | null | undefined;
  notContainsi?: boolean | null | undefined;
  notIn?: Array<boolean | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<boolean | null | undefined> | null | undefined;
  startsWith?: boolean | null | undefined;
};

export type ComponentGalleryGalleryFiltersInput = {
  alt?: StringFilterInput | null | undefined;
  and?: Array<ComponentGalleryGalleryFiltersInput | null | undefined> | null | undefined;
  caption?: StringFilterInput | null | undefined;
  not?: ComponentGalleryGalleryFiltersInput | null | undefined;
  or?: Array<ComponentGalleryGalleryFiltersInput | null | undefined> | null | undefined;
};

export type ComponentSeoSeoFiltersInput = {
  and?: Array<ComponentSeoSeoFiltersInput | null | undefined> | null | undefined;
  metaDescription?: StringFilterInput | null | undefined;
  metaTitle?: StringFilterInput | null | undefined;
  not?: ComponentSeoSeoFiltersInput | null | undefined;
  or?: Array<ComponentSeoSeoFiltersInput | null | undefined> | null | undefined;
};

export type ComponentStatsStatsFiltersInput = {
  and?: Array<ComponentStatsStatsFiltersInput | null | undefined> | null | undefined;
  distanceKm?: FloatFilterInput | null | undefined;
  elevationGainM?: IntFilterInput | null | undefined;
  elevationLossM?: IntFilterInput | null | undefined;
  movingTimeMin?: IntFilterInput | null | undefined;
  not?: ComponentStatsStatsFiltersInput | null | undefined;
  or?: Array<ComponentStatsStatsFiltersInput | null | undefined> | null | undefined;
  sleptAt?: StringFilterInput | null | undefined;
  tempC?: IntFilterInput | null | undefined;
  weather?: StringFilterInput | null | undefined;
};

export type DateFilterInput = {
  and?: Array<unknown> | null | undefined;
  between?: Array<unknown> | null | undefined;
  contains?: unknown;
  containsi?: unknown;
  endsWith?: unknown;
  eq?: unknown;
  eqi?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  lt?: unknown;
  lte?: unknown;
  ne?: unknown;
  nei?: unknown;
  not?: DateFilterInput | null | undefined;
  notContains?: unknown;
  notContainsi?: unknown;
  notIn?: Array<unknown> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<unknown> | null | undefined;
  startsWith?: unknown;
};

export type DateTimeFilterInput = {
  and?: Array<unknown> | null | undefined;
  between?: Array<unknown> | null | undefined;
  contains?: unknown;
  containsi?: unknown;
  endsWith?: unknown;
  eq?: unknown;
  eqi?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  lt?: unknown;
  lte?: unknown;
  ne?: unknown;
  nei?: unknown;
  not?: DateTimeFilterInput | null | undefined;
  notContains?: unknown;
  notContainsi?: unknown;
  notIn?: Array<unknown> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<unknown> | null | undefined;
  startsWith?: unknown;
};

export type Enum_Componentstatsstats_Sleptat =
  | 'campsite'
  | 'friend'
  | 'guesthouse'
  | 'hotel'
  | 'ryokan'
  | 'wild_camp';

export type Enum_Componentstatsstats_Weather =
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'sunny'
  | 'wind';

export type Enum_Prefecture_Region =
  | 'chubu'
  | 'chugoku'
  | 'hokkaido'
  | 'kanto'
  | 'kinki'
  | 'kyushu'
  | 'shikoku'
  | 'tohoku';

export type FloatFilterInput = {
  and?: Array<number | null | undefined> | null | undefined;
  between?: Array<number | null | undefined> | null | undefined;
  contains?: number | null | undefined;
  containsi?: number | null | undefined;
  endsWith?: number | null | undefined;
  eq?: number | null | undefined;
  eqi?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: Array<number | null | undefined> | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  ne?: number | null | undefined;
  nei?: number | null | undefined;
  not?: FloatFilterInput | null | undefined;
  notContains?: number | null | undefined;
  notContainsi?: number | null | undefined;
  notIn?: Array<number | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<number | null | undefined> | null | undefined;
  startsWith?: number | null | undefined;
};

export type IdFilterInput = {
  and?: Array<string | number | null | undefined> | null | undefined;
  between?: Array<string | number | null | undefined> | null | undefined;
  contains?: string | number | null | undefined;
  containsi?: string | number | null | undefined;
  endsWith?: string | number | null | undefined;
  eq?: string | number | null | undefined;
  eqi?: string | number | null | undefined;
  gt?: string | number | null | undefined;
  gte?: string | number | null | undefined;
  in?: Array<string | number | null | undefined> | null | undefined;
  lt?: string | number | null | undefined;
  lte?: string | number | null | undefined;
  ne?: string | number | null | undefined;
  nei?: string | number | null | undefined;
  not?: IdFilterInput | null | undefined;
  notContains?: string | number | null | undefined;
  notContainsi?: string | number | null | undefined;
  notIn?: Array<string | number | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<string | number | null | undefined> | null | undefined;
  startsWith?: string | number | null | undefined;
};

export type IntFilterInput = {
  and?: Array<number | null | undefined> | null | undefined;
  between?: Array<number | null | undefined> | null | undefined;
  contains?: number | null | undefined;
  containsi?: number | null | undefined;
  endsWith?: number | null | undefined;
  eq?: number | null | undefined;
  eqi?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: Array<number | null | undefined> | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  ne?: number | null | undefined;
  nei?: number | null | undefined;
  not?: IntFilterInput | null | undefined;
  notContains?: number | null | undefined;
  notContainsi?: number | null | undefined;
  notIn?: Array<number | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<number | null | undefined> | null | undefined;
  startsWith?: number | null | undefined;
};

export type PrefectureFiltersInput = {
  and?: Array<PrefectureFiltersInput | null | undefined> | null | undefined;
  code?: IntFilterInput | null | undefined;
  createdAt?: DateTimeFilterInput | null | undefined;
  documentId?: IdFilterInput | null | undefined;
  nameEn?: StringFilterInput | null | undefined;
  nameJa?: StringFilterInput | null | undefined;
  not?: PrefectureFiltersInput | null | undefined;
  or?: Array<PrefectureFiltersInput | null | undefined> | null | undefined;
  publishedAt?: DateTimeFilterInput | null | undefined;
  region?: StringFilterInput | null | undefined;
  stages?: StageFiltersInput | null | undefined;
  updatedAt?: DateTimeFilterInput | null | undefined;
};

export type StageFiltersInput = {
  and?: Array<StageFiltersInput | null | undefined> | null | undefined;
  body?: StringFilterInput | null | undefined;
  createdAt?: DateTimeFilterInput | null | undefined;
  date?: DateFilterInput | null | undefined;
  documentId?: IdFilterInput | null | undefined;
  endName?: StringFilterInput | null | undefined;
  excerpt?: StringFilterInput | null | undefined;
  featured?: BooleanFilterInput | null | undefined;
  gallery?: ComponentGalleryGalleryFiltersInput | null | undefined;
  locale?: StringFilterInput | null | undefined;
  localizations?: StageFiltersInput | null | undefined;
  not?: StageFiltersInput | null | undefined;
  or?: Array<StageFiltersInput | null | undefined> | null | undefined;
  prefectures?: PrefectureFiltersInput | null | undefined;
  publishedAt?: DateTimeFilterInput | null | undefined;
  routeFile?: StringFilterInput | null | undefined;
  seo?: ComponentSeoSeoFiltersInput | null | undefined;
  slug?: StringFilterInput | null | undefined;
  stageNumber?: IntFilterInput | null | undefined;
  startName?: StringFilterInput | null | undefined;
  stats?: ComponentStatsStatsFiltersInput | null | undefined;
  title?: StringFilterInput | null | undefined;
  updatedAt?: DateTimeFilterInput | null | undefined;
};

export type StringFilterInput = {
  and?: Array<string | null | undefined> | null | undefined;
  between?: Array<string | null | undefined> | null | undefined;
  contains?: string | null | undefined;
  containsi?: string | null | undefined;
  endsWith?: string | null | undefined;
  eq?: string | null | undefined;
  eqi?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: Array<string | null | undefined> | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  ne?: string | null | undefined;
  nei?: string | null | undefined;
  not?: StringFilterInput | null | undefined;
  notContains?: string | null | undefined;
  notContainsi?: string | null | undefined;
  notIn?: Array<string | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<string | null | undefined> | null | undefined;
  startsWith?: string | null | undefined;
};

export type PageQueryVariables = Exact<{
  slug: string;
  locale?: unknown;
}>;


export type PageQuery = { pages: Array<{ title: string | null, sections: Array<
      | { __typename: 'ComponentSectionsFeaturedStages', heading: string | null }
      | { __typename: 'ComponentSectionsHero', heading: string | null, introduction: string | null, subheading: string | null }
      | { __typename: 'Error' }
     | null> | null } | null> };

export type StagesQueryVariables = Exact<{
  locale?: unknown;
  sort?: Array<string | null | undefined> | string | null | undefined;
  limit?: number | null | undefined;
  filters?: StageFiltersInput | null | undefined;
}>;


export type StagesQuery = { stages: Array<{ documentId: string, slug: string | null, stageNumber: number | null, date: unknown, title: string | null, excerpt: string | null, startName: string | null, endName: string | null, featured: boolean | null, stats: { distanceKm: number | null, elevationGainM: number | null } | null, coverImage: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null, prefectures: Array<{ code: number | null, nameEn: string | null, nameJa: string | null } | null> } | null> };

export type StageQueryVariables = Exact<{
  slug: string;
  locale?: unknown;
}>;


export type StageQuery = { stages: Array<{ documentId: string, slug: string | null, stageNumber: number | null, date: unknown, title: string | null, excerpt: string | null, body: string | null, startName: string | null, endName: string | null, routeFile: string | null, gpxFile: { url: string } | null, stats: { distanceKm: number | null, elevationGainM: number | null, elevationLossM: number | null, movingTimeMin: number | null, weather: Enum_Componentstatsstats_Weather | null, tempC: number | null, sleptAt: Enum_Componentstatsstats_Sleptat | null } | null, coverImage: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null, gallery: Array<{ caption: string | null, alt: string | null, image: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null } | null> | null, prefectures: Array<{ code: number | null, nameEn: string | null, nameJa: string | null, region: Enum_Prefecture_Region | null } | null>, seo: { metaTitle: string | null, metaDescription: string | null, ogImage: { url: string, width: number | null, height: number | null } | null } | null } | null> };

export type RideTotalsQueryVariables = Exact<{ [key: string]: never; }>;


export type RideTotalsQuery = { stages: Array<{ stats: { distanceKm: number | null, elevationGainM: number | null } | null } | null> };


export const PageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Page"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentSectionsHero"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"introduction"}},{"kind":"Field","name":{"kind":"Name","value":"subheading"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentSectionsFeaturedStages"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heading"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PageQuery, PageQueryVariables>;
export const StagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StageFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"stageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"startName"}},{"kind":"Field","name":{"kind":"Name","value":"endName"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"distanceKm"}},{"kind":"Field","name":{"kind":"Name","value":"elevationGainM"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefectures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}}]}}]}}]}}]} as unknown as DocumentNode<StagesQuery, StagesQueryVariables>;
export const StageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"stageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"startName"}},{"kind":"Field","name":{"kind":"Name","value":"endName"}},{"kind":"Field","name":{"kind":"Name","value":"routeFile"}},{"kind":"Field","name":{"kind":"Name","value":"gpxFile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"distanceKm"}},{"kind":"Field","name":{"kind":"Name","value":"elevationGainM"}},{"kind":"Field","name":{"kind":"Name","value":"elevationLossM"}},{"kind":"Field","name":{"kind":"Name","value":"movingTimeMin"}},{"kind":"Field","name":{"kind":"Name","value":"weather"}},{"kind":"Field","name":{"kind":"Name","value":"tempC"}},{"kind":"Field","name":{"kind":"Name","value":"sleptAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefectures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"region"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"ogImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StageQuery, StageQueryVariables>;
export const RideTotalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RideTotals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"distanceKm"}},{"kind":"Field","name":{"kind":"Name","value":"elevationGainM"}}]}}]}}]}}]} as unknown as DocumentNode<RideTotalsQuery, RideTotalsQueryVariables>;