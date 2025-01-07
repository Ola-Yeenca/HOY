import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils';
import { ExploreFilters } from '@/hooks/useExplore';

interface ExploreFiltersProps {
  filters: ExploreFilters;
  onFilterChange: (filters: ExploreFilters) => void;
}

const categories = [
  'All',
  'Music',
  'Food & Drink',
  'Art',
  'Sports',
  'Technology',
  'Business',
  'Fashion',
  'Health',
  'Education',
];

const locations = [
  'All',
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Liverpool',
  'Newcastle',
  'Glasgow',
  'Edinburgh',
  'Cardiff',
];

export function ExploreFiltersComponent({ filters, onFilterChange }: ExploreFiltersProps) {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFilterChange({ ...filters, category: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category.toLowerCase()}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.location}
        onValueChange={(value) =>
          onFilterChange({ ...filters, location: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location} value={location.toLowerCase()}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onFilterChange({
                ...filters,
                date: newDate ? format(newDate, 'yyyy-MM-dd') : undefined,
              });
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
