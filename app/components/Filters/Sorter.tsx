import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const AscendingIcon = () => <span>&uarr;</span>;
const DescendingIcon = () => <span>&darr;</span>;

export const Sorter = ({
  fieldName, 
  currentSorter,
  updateFilter,
  className,
} : {
  fieldName: string, 
  currentSorter: string,
  updateFilter: (value: string) => void,
  className?: string,
}) => {
  const [field, order] = currentSorter.split(":");
  const isCurrent = fieldName === field;

  // For better UX, sorting state is shared across all sorters.
  const handleClick = () => {
    if (isCurrent) {
      const newOrder = order === "asc" ? "desc" : "asc";
      updateFilter(`${fieldName}:${newOrder}`);
    } else {
      updateFilter(`${fieldName}:${order}`);
    }
  }

  return (
    <Button
      type="button"
      variant={isCurrent ? "default" : "outline"}
      onClick={handleClick}
      className={cn("flex-1 flex gap-0.5 min-w-0", className)}
    >
      {fieldName}&nbsp;
      {order === "asc" ? <AscendingIcon /> : <DescendingIcon />}
    </Button>
  )
}