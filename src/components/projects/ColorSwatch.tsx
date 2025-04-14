
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { projectColors, ProjectColor } from "./types";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  value: ProjectColor;
  onChange: (value: ProjectColor) => void;
}

export function ColorSwatch({ value, onChange }: ColorSwatchProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange as (value: string) => void}
      className="flex gap-3"
    >
      {Object.entries(projectColors).map(([color, hex]) => (
        <RadioGroupItem
          key={color}
          value={color}
          id={color}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-all duration-300",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2",
            "hover:scale-110 cursor-pointer"
          )}
          style={{ backgroundColor: hex }}
        />
      ))}
    </RadioGroup>
  );
}
