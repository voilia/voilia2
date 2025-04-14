
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  return (
    <div className="flex w-full items-center space-x-2">
      <Input 
        type="search"
        placeholder="Search..."
        className="h-9 md:w-[200px] lg:w-[250px]"
      />
      <Button type="submit" size="icon" className="h-9 w-9">
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
