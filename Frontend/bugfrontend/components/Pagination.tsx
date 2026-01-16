"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  entriesText?: string; 
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  entriesText = "Showing 1 to 10 of 50 entries",
}: PaginationProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between  gap-4 text-sm text-gray-600">
      <span>{entriesText}</span>

      <div className="flex items-center gap-3">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
