"use client";

import React, { useEffect, useState } from "react";
import { ImagePlus, ChevronDown } from "lucide-react";
import api from "@/lib/api";

interface AddProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded?: () => void;
}

const AddProjectModal: React.FC<AddProjectProps> = ({ isOpen, onClose, onProjectAdded }) => {
  const [projectName, setProjectName] = useState("");
  const [details, setDetails] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    api.get("users/")
      .then(res => {
        setUsers(res.data.filter((u: any) => u.role?.toLowerCase() === "qa" || u.role?.toLowerCase() === "developer"))
      })
      .catch(error => console.log(error))
  }, [])


  if (!isOpen) return null;

  const handleAddProject = async () => {

    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("description", details);
      if (logo) {
        formData.append("logo", logo);
      }

      const res = await api.post("project/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const projectId = res.data.id;

      for (const userId of selectedUsers) {
        try {
          await api.post("project-members/", { project: projectId, user: userId });
        } 
        catch (err) { 
          console.log(`Failed to add user ${userId}`, err);
        }
      }

      alert("Project created successfully");

      setProjectName("");
      setDetails("");
      setLogo(null);
      setSelectedUsers([]);

      onClose();

      if (onProjectAdded) onProjectAdded();
    } catch (error: any) {
      console.error("Error Checking for project", error);
      alert("Failed to create project ");
    } 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white overflow-y-auto md:max-w-3xl rounded-[10px] shadow-xl p-8 md:p-8 relative max-h-[80vh]">
        <h2 className="text-1xl font-bold mb-8 text-black">Add new Project</h2>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 "
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Short details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Enter details here"
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none "
              />
            </div>  

            <div className="mt-4">
              <label className="block font-bold mb-2">Assign Members</label>
              {users.map(user => (
                <div key={user.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      if (e.target.checked) setSelectedUsers([...selectedUsers, id]);
                      else setSelectedUsers(selectedUsers.filter(x => x !== id));
                    }}
                    className="mr-3"
                  />
                  <span>{user.name} ({user.role})</span>
                </div>
              ))}
            </div>

          </div>

          <div className="w-full md:w-[280px] items-end justify-end">
            <label className="w-full p-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ">
              <div className="mb-3 text-gray-400 group-hover:scale-110 transition-transform">
                <ImagePlus size={48} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Upload logo
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddProject}
            className="py-3 bg-[#007DFA] text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            Add
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
