import type { Dog, Match } from "~/utils/types";
import { useFetcher, useNavigation } from "@remix-run/react";
import { DogCard } from "../DogList/DogCard";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";

export const FavoriteListContent = ({ 
  favorites,
  handleToggleFavorite,
} : { 
  favorites: Dog[],
  handleToggleFavorite: (dog: Dog) => void
}) => {
  const fetcher = useFetcher<Match>();
  const navigation = useNavigation();

  const isLoading = fetcher.state !=="idle" || navigation.state !== "idle";

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fetcher.submit({ favorites }, {
      action: "/api/match", 
      method: "POST", 
      encType: "application/json",
    })
  };

  return (
    <section className="flex flex-col flex-1 h-full p-6 overflow-hidden min-h-full gap-4 bg-white shadow-xl">
      <h1
        className="text-xl text-primary font-bold"
      >
        Your favorite dogs:
      </h1>
      {favorites?.length === 0 && 
        <section className="flex-1 flex overflow-y-auto items-center justify-center">
          <p className="max-w-[50ch]">
            You haven&rsquo;t selected any dogs yet.<br />
            Search and find your favorite dogs. Then use the &ldquo;Match&rdquo; button below to see your match!
          </p>
        </section>
      }
      <section className="flex min-h-0 overflow-y-auto flex-wrap gap-4">
        {favorites?.map((dog) => 
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </section>
      <section className="mt-auto flex-shrink-0 self-end">
        <Button 
          size="lg" 
          onClick={handleSubmit}
          variant={isLoading ? "secondary" : "default"}
          disabled={favorites.length === 0 || isLoading}
        >
          {isLoading
            ? "Matching..." 
            : <>
              <Heart className="w-4 h-4" />&nbsp;Match!
            </>
          }
        </Button>
      </section>
    </section>
  );
};