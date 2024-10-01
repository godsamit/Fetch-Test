import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { AGE_RANGE } from "~/utils/constants";

export const AgeFilter = ({ 
  updateFilter, 
  currentRange,
} : { 
  updateFilter: (value: number[]) => void, 
  currentRange: number[] | undefined 
}) => {
  return (
    <article className="flex flex-col items-start justify-between">
      <Label htmlFor="age">Age Range</Label>
      <Slider 
        name="age" 
        className="h-10 mb-4"
        value={currentRange} 
        defaultValue={AGE_RANGE} 
        min={0} 
        max={14} 
        onValueChange={(value) => 
          updateFilter(value)
        }
        formatLabel={(value) => 
          value !== undefined ? `${value} yr${value > 1 ? "s" : ""}` : "None"
        }
      />
    </article>
  );
}