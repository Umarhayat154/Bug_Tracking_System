"use client";
import { Briefcase } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
}
        
interface ProjectCardProps {
  project: Project;
  tasksDone?: number;
  totalTasks?: number;
  onClick?: () => void;
  bgColor?: string;
}

export default function ProjectCard({
  project,
  tasksDone = 0,
  totalTasks = 0,
  onClick,
  bgColor = "bg-white",
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${bgColor}`}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#d1eaf6] mb-3">
        {project.logo_url ? (
          <img
            src={project.logo_url}
            alt={`${project.name} logo`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Briefcase className="text-gray-500 w-6 h-6" />
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-gray-900 truncate group-hover:text-blue-600">
        {project.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1  min-h-40px">
        {project.description || "No description"}
      </p>

      <div className="mt-4">
        <span className="text-sm font-medium text-gray-700">
          Tasks Done: {tasksDone}/{totalTasks}
        </span>
      </div>
    </div>
  );
}
