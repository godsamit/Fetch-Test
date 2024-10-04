import { Dog } from "~/utils/types";
import { createCookie } from "@remix-run/node";
export const favorite = createCookie("favorite");

export const toggleFavorite = (favorites: Dog[], dog: Dog): Record<string, Dog[]> => {
  return {
    favorite: favorites.some((favoriteDog) => favoriteDog.id === dog.id)
      ? favorites.filter((favoriteDog) => favoriteDog.id !== dog.id)
      : [...favorites, dog],
  };
};