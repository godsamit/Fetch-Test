import type { DogsSearchResponse, Dog, FavoriteList } from "~/utils/types"
import { DogCard } from "./DogCard";
import { DogListPagination } from "./DogListPagination";
import { useEffect } from "react";
import { useFetcher, useNavigation } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";

export const DogList = ({ 
  dogSearchMeta, 
  dogs
} : {
  dogSearchMeta: DogsSearchResponse, 
  dogs: Dog[] 
}) => {
  const fetcher = useFetcher<FavoriteList>();
  const navigation = useNavigation();

  const favorites = fetcher.data?.favorite || [];

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/cookie_state/favorites");      
    }
  }, [fetcher]);

  const handleToggleFavorite = (id: string) => {
    fetcher.submit({
      favorite: favorites.includes(id)
        ? favorites.filter((favorite) => favorite !== id)
        : [...favorites, id],
    }, {
      action: "/cookie_state/favorites", 
      method: "POST", 
      encType: "application/json",
    });
  };

  return (
    <section className="flex flex-col flex-1 h-full overflow-hidden min-h-full p-6 pr-0 gap-4">
      {navigation.state === "loading" && 
        <section className="flex-1 flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </section>
      }
      {navigation.state==="idle" && dogs?.length === 0 && 
        <section className="flex-1 flex overflow-y-auto items-center justify-center">
          <p>No dogs found</p>
        </section>
      }
      {navigation.state==="idle" && 
        <section className="flex min-h-0 overflow-y-auto flex-wrap gap-4">
          {dogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog}
              isFavorite={favorites.includes(dog.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </section>
      }
      <DogListPagination
        dogSearchMeta={dogSearchMeta}
      />
    </section>
  )
};