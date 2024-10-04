import type { Dog } from "~/utils/types";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card } from "~/components/ui/card";

export const MatchCard = ({ matchedDog } : { matchedDog: Dog }) => {
  useEffect(() => {
    // confetti runs on the client side cos it needs the window object
    if (typeof document !== "undefined" && matchedDog) {
      requestAnimationFrame(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      });
    }
  }, []);

  if (!matchedDog) {
    return (
      <Card className="w-full p-10 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">No Match Found...</h1>
        <p>
          You don&rsquo;t have a match yet. <br />
          When you&rsquo;re done selecting your favorite dogs, expand the right panel, click the &ldquo;Match&rdquo; button to see your match here.
        </p>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <img 
        src={matchedDog.img} 
        alt={matchedDog.name} 
        className="w-full h-96 object-cover rounded-t-xl" 
      />
      <div className="flex p-4 flex-col">
        <h1 className="text-2xl text-primary font-bold">{matchedDog.name}</h1>
        <h2 className="text-base text-primary">{matchedDog.breed}</h2>
        <div className="flex justify-between mt-1.5" >
          <h3 className="text-sm opacity-50 font-bold">Age: {matchedDog.age}</h3>
          <h4 className="text-sm opacity-50 font-bold">Zip Code: {matchedDog.zip_code}</h4>
        </div>
      </div>
    </Card>
  )
}