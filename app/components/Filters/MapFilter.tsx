import type { Location } from "~/utils/types";
import { useSearchParams } from "@remix-run/react";
import { MapWithBoundingBox } from "./MapWithBoundingBox";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { InfoCircledIcon } from "@radix-ui/react-icons";

export const MapFilter = ({ 
  onBoundingBoxChange
} : { 
  onBoundingBoxChange: (
    boundingBox: { 
      top_right: Location,
      bottom_left: Location,
    },
    silent?: boolean
  ) => void
}) => {
  const [searchParams] = useSearchParams();

  const zipCodes = searchParams.getAll("zipCodes");

  return (
    <article className="flex flex-col gap-1 w-full items-start justify-between">
      <Label htmlFor="city">Location</Label>
      <MapWithBoundingBox onBoundingBoxChange={onBoundingBoxChange} />
      <TooltipProvider
        delayDuration={100}
      >
        <Tooltip>
          <TooltipTrigger className="hidden md:block">
            <Badge
              className="mt-2 text-xs cursor-pointer flex items-center gap-1"
              variant="secondary"
            >
              <InfoCircledIcon />Currently applied zip codes
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="max-w-xl text-secondary-foreground bg-secondary shadow-xl"
          >
            {zipCodes.join(", ")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </article>
  );
};