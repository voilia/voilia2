
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption, ViewMode } from "./types";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export { type ViewMode, type SortOption };

export function ViewToggle({ viewMode, setViewMode, sortOption, setSortOption }: ViewToggleProps) {
  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "name":
        return "Name A–Z";
      case "created_at":
        return "Recently Created";
      default:
        return "Last Updated";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1">
            <span>Sort: {getSortLabel(sortOption)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortOption("updated_at")}>
            Last Updated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption("name")}>
            Name A–Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption("created_at")}>
            Recently Created
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
