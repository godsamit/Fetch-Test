import { Form } from "@remix-run/react";
import type { DogFilter } from "~/utils/types";
import { FilterPanel } from "./FilterPanel";
import { FilterContent } from "./FilterContent";
import { DEFAULT_SORT, SORTABLE_FIELDS } from "~/utils/constants";
import { cn } from "~/lib/utils";

export const Filters = ({ 
  isLoading,
  filters,
  setFilters,
  filtersChanged,
  setFiltersChanged,
  handleSubmit 
} : {
  isLoading: boolean,
  filters: Partial<DogFilter>,
  setFilters: React.Dispatch<React.SetStateAction<Partial<DogFilter>>>,
  filtersChanged: boolean,
  setFiltersChanged: React.Dispatch<React.SetStateAction<boolean>>,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, filters: Partial<DogFilter>) => void 
}) => {
  return (
    <FilterPanel>
      <FilterContent
        isLoading={isLoading} 
        filters={filters} 
        setFilters={setFilters}
        filtersChanged={filtersChanged}
        setFiltersChanged={setFiltersChanged}
        handleSubmit={handleSubmit}
      />
    </FilterPanel>
  )
};