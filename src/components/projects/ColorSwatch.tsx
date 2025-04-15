
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { projectColors, ProjectColor } from "./types";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  value: ProjectColor;
  onChange: (value: ProjectColor) => void;
  id?: string;
  name?: string;
}

export function ColorSwatch({ value, onChange, id, name }: ColorSwatchProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange as (value: string) => void}
      className="grid grid-cols-5 sm:flex gap-2 sm:gap-3"
      id={id}
      name={name}
    >
      {Object.entries(projectColors).map(([color, hex]) => (
        <div 
          key={color}
          className="relative flex items-center justify-center"
        >
          <RadioGroupItem
            value={color}
            id={`${id}-${color}`}
            className={cn(
              "w-9 h-9 rounded-full cursor-pointer transition hover:scale-105",
              "data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
              "dark:data-[state=checked]:ring-offset-[#342a52]"
            )}
            style={{ 
              backgroundColor: hex,
              borderColor: hex,
              '--ring-color': hex,
            } as React.CSSProperties}
          />
        </div>
      ))}
    </RadioGroup>
  );
}
