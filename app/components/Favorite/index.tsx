import { useState } from "react"

export const Favorite = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={()=>setIsOpen(!isOpen)} className="relative">Favorites</button>
    </div>
  );
};