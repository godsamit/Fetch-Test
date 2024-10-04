import type { DogFilter } from "~/utils/types";
import { useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { FilterContent } from "./FilterContent";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterPanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <FilterContent
        isLoading={isLoading} 
        filters={filters} 
        setFilters={setFilters}
        filtersChanged={filtersChanged}
        setFiltersChanged={setFiltersChanged}
        handleSubmit={(e: React.FormEvent<HTMLFormElement>, filters: Partial<DogFilter>) => {
          setIsOpen(false);
          handleSubmit(e, filters);
        }}
      />
    </FilterPanel>
  )
};