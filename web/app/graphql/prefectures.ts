// app/graphql/prefectures.ts
import { graphql } from "~/gql";

export const PrefectureQuery = graphql(`
  query Prefectures {
    prefectures {
      nameJa
      nameEn
      code
      region
    }
  }
`);
