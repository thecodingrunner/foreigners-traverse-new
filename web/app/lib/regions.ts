// app/lib/regions.ts
export const REGIONS = ["kyushu", "chugoku", "shikoku", "kinki", "chubu", "kanto", "tohoku"] as const;
export type Region = (typeof REGIONS)[number];

export function parseRegion(value: string | null): Region | null {
  return REGIONS.includes(value as Region) ? (value as Region) : null;
}