import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { CaretSortIcon, PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Label } from "~/components/ui/label";
import { LoaderIcon } from "lucide-react";
 

export function BreedFilter({ 
  selectedBreeds, 
  updateFilter 
} : { 
  selectedBreeds: string[] | undefined, 
  updateFilter: (value: string) => void 
}) {
  const fetcher = useFetcher<{ breeds: string[] }>();

  useEffect(() => {
    fetcher.load("/api/breeds")
  }, [fetcher]);

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 items-start justify-between">
      <Label htmlFor="breed">Select a breed</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>            
          <Button
            name="breed"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-auto justify-between"
          >
            <span className="whitespace-normal text-left">
              {selectedBreeds?.join(", ") || "None"}
            </span>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search breeds..." className="h-9" />
            <CommandList>
              <CommandEmpty>
                <LoaderIcon className="animate-spin "/>
              </CommandEmpty>
              <CommandGroup>
                {fetcher.state !== "loading" && fetcher.data?.breeds.map((breed) => (
                  <CommandItem
                    className="gap-2 cursor-pointer"
                    key={breed}
                    value={breed}
                    onSelect={(currentValue) => {
                      updateFilter(currentValue)
                    }}
                  >
                    <div className="h-4 w-4">
                      {selectedBreeds?.includes(breed) 
                        ? <MinusIcon />
                        : <PlusIcon />
                      }
                    </div>
                    <span 
                      className={cn(
                        "flex-1",
                        selectedBreeds?.includes(breed) && "font-bold"
                      )}
                    >
                      {breed}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
