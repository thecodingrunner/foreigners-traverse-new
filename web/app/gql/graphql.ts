/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type PageQueryVariables = Exact<{
  slug: string;
  locale?: unknown;
}>;


export type PageQuery = { pages: Array<{ title: string | null, sections: Array<
      | { __typename: 'ComponentSectionsHero', heading: string | null, introduction: string | null, subheading: string | null }
      | { __typename: 'Error' }
     | null> | null } | null> };

export type StagesQueryVariables = Exact<{
  locale?: unknown;
  sort?: Array<string | null | undefined> | string | null | undefined;
  limit?: number | null | undefined;
}>;


export type StagesQuery = { stages: Array<{ documentId: string, slug: string | null, stageNumber: number | null, date: unknown, title: string | null, excerpt: string | null, startName: string | null, endName: string | null, featured: boolean | null, stats: { distanceKm: number | null, elevationGainM: number | null } | null, coverImage: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null, prefectures: Array<{ code: number | null, nameEn: string | null, nameJa: string | null } | null> } | null> };

export type StageQueryVariables = Exact<{
  slug: string;
  locale?: unknown;
}>;


export type StageQuery = { stages: Array<{ documentId: string, slug: string | null, stageNumber: number | null, date: unknown, title: string | null, excerpt: string | null, body: string | null, startName: string | null, endName: string | null, routeFile: string | null, gpxFile: { url: string } | null, stats: { distanceKm: number | null, elevationGainM: number | null, elevationLossM: number | null, movingTimeMin: number | null, weather: Enum_Componentstatsstats_Weather | null, tempC: number | null, sleptAt: Enum_Componentstatsstats_Sleptat | null } | null, coverImage: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null, gallery: Array<{ caption: string | null, alt: string | null, image: { url: string, alternativeText: string | null, width: number | null, height: number | null } | null } | null> | null, prefectures: Array<{ code: number | null, nameEn: string | null, nameJa: string | null, region: Enum_Prefecture_Region | null } | null>, seo: { metaTitle: string | null, metaDescription: string | null, ogImage: { url: string, width: number | null, height: number | null } | null } | null } | null> };


export const PageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Page"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentSectionsHero"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"introduction"}},{"kind":"Field","name":{"kind":"Name","value":"subheading"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PageQuery, PageQueryVariables>;
export const StagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"stageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"startName"}},{"kind":"Field","name":{"kind":"Name","value":"endName"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"distanceKm"}},{"kind":"Field","name":{"kind":"Name","value":"elevationGainM"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefectures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}}]}}]}}]}}]} as unknown as DocumentNode<StagesQuery, StagesQueryVariables>;
export const StageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Stage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"I18NLocaleCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"stageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"startName"}},{"kind":"Field","name":{"kind":"Name","value":"endName"}},{"kind":"Field","name":{"kind":"Name","value":"routeFile"}},{"kind":"Field","name":{"kind":"Name","value":"gpxFile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"distanceKm"}},{"kind":"Field","name":{"kind":"Name","value":"elevationGainM"}},{"kind":"Field","name":{"kind":"Name","value":"elevationLossM"}},{"kind":"Field","name":{"kind":"Name","value":"movingTimeMin"}},{"kind":"Field","name":{"kind":"Name","value":"weather"}},{"kind":"Field","name":{"kind":"Name","value":"tempC"}},{"kind":"Field","name":{"kind":"Name","value":"sleptAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefectures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"region"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"ogImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StageQuery, StageQueryVariables>;