import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "~/lib/utils"

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  className?: string;
  formatLabel?: (value: number | undefined) => string;
};


const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, formatLabel, ...props }, ref) => {
  const initialValue = Array.isArray(props.value) ? props.value : [props.min, props.max]

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <div className="absolute text-xs whitespace-nowrap -bottom-5 left-1/2 transform -translate-x-1/2 z-30 rounded-md border bg-popover text-popover-foreground shadow-sm px-2">
              {formatLabel ? formatLabel(value) : value}
            </div>
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }