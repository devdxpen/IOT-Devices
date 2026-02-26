import { Search, List, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GroupFilterState } from "@/types/group";
import { ViewMode } from "@/types/device";

interface GroupFiltersProps {
  filters: GroupFilterState;
  viewMode: ViewMode;
  onFilterChange: (key: keyof GroupFilterState, value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onClearFilters: () => void;
  onCreateGroup: () => void;
}

export function GroupFilters({
  filters,
  viewMode,
  onFilterChange,
  onViewModeChange,
  onCreateGroup,
}: GroupFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Group Management</h2>
        <p className="text-sm text-muted-foreground">
          {viewMode === "list" ? "List View" : "Grid View"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-10 w-[220px]"
          />
        </div>

        <Button onClick={onCreateGroup} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>

        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="rounded-none h-9 w-9"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="icon"
            className="rounded-none h-9 w-9"
            onClick={() => onViewModeChange("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
