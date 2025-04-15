
import { Folder } from "lucide-react";

interface ProjectIconProps {
  color?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function ProjectIcon({ color = "#8E9196", size = "md" }: ProjectIconProps) {
  const iconStyles = {
    backgroundColor: `${color}20`,
    color: color,
  };

  return (
    <div
      className={`rounded-full p-2 transition-colors hover:bg-[var(--hover-bg)]`}
      style={{ ...iconStyles, "--hover-bg": `${color}33` } as React.CSSProperties}
    >
      <Folder className={sizeMap[size]} />
    </div>
  );
}
