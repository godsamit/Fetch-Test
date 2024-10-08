import { Form } from "@remix-run/react";
import type { DogFilter } from "~/utils/types";
import { MapFilter } from "./MapFilter";
import { BreedFilter } from "./BreedFilter";
import { AgeFilter } from "./AgeFilter";
import { Sorter } from "./Sorter";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { DEFAULT_SORT, SORTABLE_FIELDS } from "~/utils/constants";
import { cn } from "~/lib/utils";

export const FilterContent = ({ 
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
  // 'silent' is used to bypass filterChanged state update
  // used for initial map loading
  const updateFilter = (key: string) => (value: unknown, silent = false) => {
    if (!filtersChanged && !silent) setFiltersChanged(true);
    switch(key) {
      case "ageRange": {
        setFilters((prevFilters) => ({ 
          ...prevFilters, 
          ageMin: (value as number[])[0], 
          ageMax: (value as number[])[1],
        }));
        break;
      }
      case "breeds": {
        const updatedBreeds = (filters.breeds?.includes(value as string) 
          ? filters.breeds?.filter((breed) => breed !== value) 
          : [...(filters.breeds || []), value as string])
        setFilters((prevFilters) => ({ ...prevFilters, breeds: updatedBreeds}));
        break;
      }
      default: {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
      }
    }
  }

  return (
    <article className="w-full h-screen mb-auto shadow-xl bg-white">
      <Form 
        className={cn(
          "p-6 h-full no-scrollbar overflow-y-auto w-full",
          isLoading && "opacity-50 pointer-events-none"
        )} 
        onSubmit={(e) => handleSubmit(e, filters)}
      >
        <div className="h-full flex flex-col gap-8 w-full md:w-[250px]">
          <section className="flex flex-col gap-4">
            <h1 className="font-bold">Filter</h1>
            <BreedFilter
              selectedBreeds={filters.breeds} 
              updateFilter={updateFilter("breeds")} 
            />
            <AgeFilter 
              currentRange={
                (filters.ageMin !== undefined && filters.ageMax !== undefined) 
                  ? [filters.ageMin, filters.ageMax] 
                  : undefined
              } 
              updateFilter={updateFilter("ageRange")}
            />
            <MapFilter onBoundingBoxChange={updateFilter("geoBoundingBox")} />
          </section>
          <section className="flex flex-col gap-4">
            <h1 className="font-bold">Sort</h1>
            <ButtonGroup className="w-full">
              {SORTABLE_FIELDS.map((fieldName) => (
                <Sorter 
                  key={fieldName} 
                  fieldName={fieldName} 
                  currentSorter={filters.sort ?? DEFAULT_SORT}
                  updateFilter={updateFilter("sort")}
                />
              ))}
            </ButtonGroup>
          </section>
          <Button 
            className="w-full mt-auto" 
            type="submit"
            variant={(!filtersChanged || isLoading) ? "secondary" : "default"}
            disabled={!filtersChanged || isLoading}
          >
            Search!
          </Button>
        </div>
      </Form>
    </article>
  )
};