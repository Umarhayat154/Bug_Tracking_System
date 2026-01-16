"use client";


import { Search, LayoutGrid, List } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  assignedTo?: string[];
  onAssignedChange?: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  assignedTo = ["All"],
  onAssignedChange,
  viewMode,
  onViewModeChange,
}: SearchBarProps) {
  return (
    <div className="mt-2 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-64">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Assigned To</span>
          <select
            onChange={(e) => onAssignedChange?.(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {assignedTo.map((opt, id) => (
              <option key={id} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-md ${
              viewMode === "grid"
                ? "bg-gray-100 text-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-md  ${
              viewMode === "list"
                ? "bg-gray-100 text-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
