import type { DogsSearchResponse,Dog } from "~/utils/types"
import { useState } from "react";
import { DogCard } from "./DogCard";
import { DogListPagination } from "./DogListPagination";
import { useNavigate, useSearchParams, useNavigation } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { DEFAULT_PAGE_SIZE } from "~/utils/constants";

export const DogList = ({ 
  dogSearchMeta, 
  dogs
} : {
  dogSearchMeta: DogsSearchResponse, 
  dogs: Dog[] 
}) => {
  // Store favorite dogs
  const [favorite, setFavorite] = useState<Dog[]>([]);

  const navigation = useNavigation();

  /* pagination logic */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageSize = searchParams.get("size") ? parseInt(searchParams.get("size")!) : DEFAULT_PAGE_SIZE;
  const from = searchParams.get("from") ? parseInt(searchParams.get("from")!) : 0;

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete("from");
    } else {
      newSearchParams.set("from", ((page - 1) * pageSize).toString());
    }
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  }
  /* pagination logic */


  return (
    <section className="flex flex-col flex-1 h-full overflow-hidden min-h-full p-6 gap-4">
      {navigation.state === "loading" && 
        <section className="flex-1 flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </section>
      }
      {navigation.state==="idle" && dogs.length === 0 && 
        <section className="flex-1 flex overflow-y-auto items-center justify-center">
          <p>No dogs found</p>
        </section>
      }
      {navigation.state==="idle" && 
        <section className="flex-1 flex min-h-0 overflow-y-auto flex-wrap gap-4">
          {dogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              setFavorite={setFavorite} 
            />
          ))}
        </section>
      }
      <DogListPagination
        totalPages={Math.ceil(dogSearchMeta.total/pageSize)}
        currentPage={from / pageSize + 1}
        onPageChange={handlePageChange}
      />
    </section>
  )
};