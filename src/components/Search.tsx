
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchProps {
  value?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

export function Search({ 
  value = "", 
  onSearch, 
  placeholder = "Search...", 
  id = "search-input",
  name = "search-query" 
}: SearchProps) {
  const [query, setQuery] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onSearch?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input 
        type="search"
        placeholder={placeholder}
        className="h-9 md:w-[200px] lg:w-[250px]"
        value={query}
        onChange={handleChange}
        id={id}
        name={name}
        autoComplete="off"
      />
      <Button type="submit" size="icon" className="h-9 w-9">
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
