import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { TextAlignCenterIcon as FilterIcon, Cross1Icon } from "@radix-ui/react-icons";

export const FilterPanel = ({
  children,
} : {
  children:React.ReactNode,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchParams] = useSearchParams();

  return (
    <>
      {!isOpen &&
        <Button
          className="w-auto h-auto p-2 rounded-full fixed top-12 left-4 z-10 block md:hidden"
          title="Filters"
          aria-label="Configure Filters"
          onClick={() => setIsOpen(true)}
        >
          <FilterIcon className="w-8 h-8" />
        </Button>
      }
      <aside 
        className={cn(
          "transition-translate duration-1000 ease-in-out w-screen md:w-auto h-screen absolute md:static flex transform -translate-x-full md:translate-x-0 flex-shrink-0 z-10",
          isOpen && "translate-x-0"
        )}
      >

        {isOpen &&
          <button 
            className="absolute top-4 right-4 block md:hidden" 
            title="Close sidebar"
            disabled={!searchParams.has("zipCodes")}
            onClick={() => setIsOpen(false)}
          >
            <Cross1Icon className="w-6 h-6 text-gray-500"/>
          </button>
        }
        {children}
      </aside>
    </>
  )
}