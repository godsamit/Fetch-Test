import type { DogsSearchResponse, Dog, FavoriteList } from "~/utils/types"
import { DogCard } from "./DogCard";
import { DogListPagination } from "./DogListPagination";
import { useEffect } from "react";
import { useFetcher, useNavigation } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { toggleFavorite } from "~/cookie_state/favorite";

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

  /* 
    useFetcher is designed to be very coupled with the component
    Duplication of logic is intentional.
  */
  const handleToggleFavorite = (dog: Dog) => {
    fetcher.submit({
      favorite: favorites.some((favoriteDog) => favoriteDog.id === dog.id)
        ? favorites.filter((favoriteDog) => favoriteDog.id !== dog.id)
        : [...favorites, dog],
    }, {
      action: "/cookie_state/favorites", 
      method: "POST", 
      encType: "application/json",
    });
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden min-h-full p-6 gap-4">
      {(navigation.state === "loading" || !dogs) && 
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
          {dogs?.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog}
              isFavorite={favorites.some((favoriteDog) => favoriteDog.id === dog.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </section>
      }
      <DogListPagination
        dogSearchMeta={dogSearchMeta}
      />
    </div>
  )
};