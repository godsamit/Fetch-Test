import { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import { Dog } from "~/utils/types";

export const SidePanelRight = ({
  children,
  favorites,
} : {
  children:React.ReactNode,
  favorites: Dog[]
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Effect to trigger ping animation when something's added to the favorite list
  const [isPinging, setIsPinging] = useState(false);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (favorites.length > prevLengthRef.current) {
      setIsPinging(true);
      const timeout = setTimeout(() => {
        setIsPinging(false);
      }, 1000); 
      prevLengthRef.current = favorites.length;
      return () => clearTimeout(timeout);
    } else {
      prevLengthRef.current = favorites.length;
    }
  }, [favorites.length]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/10 backdrop-blur-md transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none" 
        )}
        onClick={() => setIsOpen(false)}
        role="button"
        tabIndex={0} 
        aria-label="Close sidebar"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(false);
          }
        }}
      />
      <aside 
        className={cn(
          "transition-translate duration-1000 ease-in-out h-screen absolute right-12 w-[918px] flex transform translate-x-full",
          isOpen && "translate-x-12"
        )}
      >
        <div className="h-full w-12 flex items-center">
          <Button 
            onClick={() => setIsOpen(!isOpen)} 
            className="relative rounded-r-none w-12 p-0 h-12 hover:bg-primary"
            title={`You have ${favorites.length} favorite dog${favorites.length > 1 ? "s" : ""}`}
          >
            <Heart className="w-6 h-6" />
            {isPinging &&
              <div 
                className="absolute -left-3 -top-3 w-6 h-6 rounded-full 
                bg-red-500 animate-ping"
              />
            }
            <div 
              className={cn("absolute -left-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center text-xs",
                favorites.length > 0 ? "bg-red-500" : " bg-gray-600"
              )}>
              {favorites.length}
            </div>
          </Button>
        </div>
        {children}
      </aside>
    </>
  )
}