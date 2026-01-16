"use client";
import { useState } from "react";
import { Bug } from "./BugTable";
import BugDetailModel from "./BugDetailModel";  
interface BugGridProps {
  bugs: Bug[];
  onBugUpdated?: () => void;
}

export default function BugGrid({ bugs, onBugUpdated }: BugGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const openBugDetail = (bug: Bug) => {
    setSelectedBug(bug);
    setIsOpen(true);
  };

  const getStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-red-50 text-red-500";
      case "started":
        return "bg-blue-50 text-blue-500";
      case "resolved":
      case "completed":
        return "bg-green-50 text-green-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="bg-gray-100 p-5 rounded-xl border border-gray-300 shadow-sm hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-900 pr-4 hover:text-blue-600 cursor-pointer">
              {bug.title}
            </h3>
            <button className="text-gray-400 hover:text-gray-600 font-bold">⋮</button>
          </div>

          <span
            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase inline-block ${getStatus(
              bug.status
            )}`}
          >
            {bug.status}
          </span>

          <div className="mt-8 space-y-4">
            <div className="flex justify-`between` items-center text-sm">
              <span className="text-blue-900">Due Date</span>
              <span className="text-gray-900 font-medium">{bug.dueDate}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-900">Assigned To</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {bug.assignedTo.map((user, id,) => (
                    <img
                      key={id}
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-lg"
                    />
                  ))}
                </div>
                <span className="text-gray-900 font-medium">Member</span>
              </div>
            </div>
          </div>

          <button onClick={()=>openBugDetail(bug)} className="w-full mt-3 py-2 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all">
            View Details
          </button>
        </div>
      ))}
       {selectedBug && (
        <BugDetailModel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onBugUpdated={onBugUpdated}
          bugData={{
            id: selectedBug.id,
            title: selectedBug.title,
            status: selectedBug.status,
            description: selectedBug.description,
            type: selectedBug.type,
            createdAt: selectedBug.dueDate,
            assignedTo: selectedBug.assignedTo,
            attachmentUrl: selectedBug.attachmentUrl,
          }}
        />
      )}
    </div>
  );
}
