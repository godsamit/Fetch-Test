import type { Dog } from "~/utils/types";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react"; 

export const HeartButton = ({ 
  isFavorite, 
  onToggleFavorite
} : {
  isFavorite: boolean,
  onToggleFavorite: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Only trigger pulse animation when like
    if (!isFavorite) {
      setIsPulsing(true);
      onToggleFavorite(e);
      setTimeout(() => {
        setIsPulsing(false);
      }, 500);
    } else {
      onToggleFavorite(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "transision-transform duration-300",
        isFavorite ? "text-red-600" : "text-gray-300",
        isPulsing && "pulse"
      )}
    >
      <Heart className={cn("w-7 h-7", isFavorite && "fill-red-600")} />
    </button>
  );
};
 
export const DogCard = ({ 
  dog,
  isFavorite,
  onToggleFavorite
} : { 
  dog: Dog, 
  isFavorite: boolean,
  onToggleFavorite: (dog: Dog) => void
}) => {

  return (
    <article className="basis-[16rem] flex-shrink-0">
      <Card>
        <img 
          src={dog.img} 
          alt={dog.name} 
          className="w-full h-48 object-cover rounded-t-xl" 
        />
        <div className="flex p-4 flex-col">
          
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-primary font-bold">{dog.name}</h1>
              <HeartButton
                isFavorite={isFavorite}
                onToggleFavorite={() => onToggleFavorite(dog)}
              />
            </div>
            <h2 className="text-base text-primary">{dog.breed}</h2>
          <div className="flex justify-between mt-1.5" >
            <h3 className="text-sm opacity-50 font-bold">Age: {dog.age}</h3>
            <h4 className="text-sm opacity-50 font-bold">Zip Code: {dog.zip_code}</h4>
          </div>
        </div>
      </Card>
    </article>
  );
}