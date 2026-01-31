import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookSearchProps {
  onSearch: (query: string) => void;
}

export function BookSearch({ onSearch }: BookSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search books by title, author, or description..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
