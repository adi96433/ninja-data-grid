import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HealthStatus } from "@/types/character";

interface HealthFilterProps {
  selectedFilters: Set<HealthStatus>;
  onFilterChange: (filters: Set<HealthStatus>) => void;
}

const healthOptions: HealthStatus[] = ["Healthy", "Injured", "Critical"];

export function HealthFilter({ selectedFilters, onFilterChange }: HealthFilterProps) {
  const handleFilterToggle = (status: HealthStatus) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(status)) {
      newFilters.delete(status);
    } else {
      newFilters.add(status);
    }
    onFilterChange(newFilters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Filter by health status"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-popover pointer-events-auto z-50"
      >
        {healthOptions.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedFilters.has(status)}
            onCheckedChange={() => handleFilterToggle(status)}
            aria-label={`Filter ${status}`}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
