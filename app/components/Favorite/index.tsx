import type { Dog, FavoriteList } from "~/utils/types";
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { SidePanelRight } from "./SidePanelRight";
import { FavoriteListContent } from "./FavoriteListContent";

export const Favorite = () => {
  const fetcher = useFetcher<FavoriteList>();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/cookie_state/favorites");      
    }
  }, [fetcher]);

  const favorites = fetcher.data?.favorite || [];

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
    <SidePanelRight
      favorites={favorites}
    >
      <FavoriteListContent
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
      />
    </SidePanelRight>
  );
};