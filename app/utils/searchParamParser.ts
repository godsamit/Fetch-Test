// Quick and dirty, opnionated search param parser only for dog search filters.

import type { DogFilter } from "./types";
import { DEFAULT_SORT } from "./constants";

export const searchParamToFilter = (searchParams: URLSearchParams): Partial<DogFilter> => {
  return {
    breeds: searchParams.getAll("breeds") || [],
    zipCodes: searchParams.getAll("zipCodes") || [],
    ageMin: searchParams.get("ageMin") ? parseInt(searchParams.get("ageMin")!) : undefined,
    ageMax: searchParams.get("ageMax") ? parseInt(searchParams.get("ageMax")!) : undefined,
    size: searchParams.get("size") ? parseInt(searchParams.get("size")!) : undefined,
    sort: searchParams.get("sort") || DEFAULT_SORT,
  }
}
