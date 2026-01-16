"use client";
import { MoreVertical, Calendar } from "lucide-react";
import { useState } from "react";
import BugDetailModel from "./BugDetailModel";

export interface Bug {  
  id: string;
  title: string;
  description?: string;
  status: string;
  type: 'bug' | 'feature';
  dueDate: string;
  assignedTo: { name: string; avatar: string }[];
  attachmentUrl?: string;
}

interface BugTableProps {
  bugs: Bug[];
  onBugUpdated?:() => void
}

export default function BugTable({ bugs, onBugUpdated }: BugTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const openBug = (bug: Bug) => {
    
    setSelectedBug(bug);
    setIsOpen(true)
  };

  const getStatusStyles = (status: string) => {
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

  const getDotColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-500";
      case "started":
        return "bg-blue-500";
      case "resolved":
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mt-6 w-full overflow-hidden border border-gray-100 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-bold tracking-wider border-b border-gray-100">
            <th className="px-6 py-4">Bug Details</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Due Date</th>
            <th className="px-6 py-4">Assigned To</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bugs.map((bug) => (
            <tr
              key={bug.id}
              className="hover:bg-gray-50/80 transition-all group cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(bug.status)}`} />
                  <span onClick={() => openBug(bug)} className="text-sm text-gray-600 font-medium leading-tight group-hover:text-blue-600 transition-colors">
                    {bug.title}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold inline-block w-24 text-center capitalize ${getStatusStyles(bug.status)}`}>
                  {bug.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center text-blue-500/70">
                  {bug.dueDate}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex -space-x-2">
                  {bug.assignedTo.map((user, id) => (
                    <img key={id} src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><MoreVertical size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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