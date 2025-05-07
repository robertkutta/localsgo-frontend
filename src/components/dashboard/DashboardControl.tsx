import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"


export interface DashboardControlProps {
  areaName: string;
  sortOption: SortOption;
  toggleShowFilters: () => void;
  setSortOption: (option: SortOption) => void;
} 

export type SortOption = 'nearest' | 'recent' | 'popular';

const sortOptions: Record<SortOption, string> = {
  'nearest': 'Nearest',
  'recent': 'Recently Added',
  'popular': 'Most Popular'
};

export function DashboardControl({
  areaName,
  sortOption,
  toggleShowFilters,
  setSortOption
}: DashboardControlProps) {
  
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="area-header">
        <h2 className="text-3xl font-bold tracking-tight">Discover {areaName}</h2>
        <p className="text-muted-foreground">Explore local recommendations in this area</p>
      </div>
      
      <div className="controls-wrapper flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="filter-btn gap-2"
          onClick={toggleShowFilters}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by: {sortOptions[sortOption]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-1000">
            {Object.entries(sortOptions).map(([option, label]) => (
              <DropdownMenuItem 
                key={option}
                onClick={() => setSortOption(option as SortOption)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 