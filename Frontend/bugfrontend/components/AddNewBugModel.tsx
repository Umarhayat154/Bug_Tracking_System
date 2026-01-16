"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, User, Paperclip } from "lucide-react";
import api from "@/lib/api";

interface AddNewBugModalProps {
  projectId: number | string;
  isOpen: boolean;
  onClose: () => void;
  onBugAdded?: () => void;
}

const AddNewBugModal: React.FC<AddNewBugModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onBugAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("bug");
  const [developers, setDevelopers] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDevelopers = async () => {
      if (!projectId) return
      try {
        const membersRes = await api.get(`project-members/?project=${projectId}`)
        const usersRes = await api.get("users/")
        const devs = membersRes.data
          .map((member: any) => usersRes.data.find((u: any) => u.id === member.user))
          .filter((user: any, index: number, self: any[]) => user && user.role === "developer" && self.findIndex(u => u.id === user.id) === index)
        setDevelopers(devs)
      } catch (error) {
        console.error("Failed to fetch developers", error)
      }
    }

    if (projectId && isOpen) {
      fetchDevelopers()
    }
  }, [projectId, isOpen])

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      setError("Bug title is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("project", projectId.toString());
      formData.append("title", title);
      if (description) formData.append("detail", description);
      if (deadline) formData.append("deadline", deadline);
      formData.append("status", "new");
      formData.append("type", type);
      if (assigneeId) formData.append("assignee_id", assigneeId);

      if (screenshot) {
        if (!["image/png", "image/gif"].includes(screenshot.type)) {
          setError("Only PNG/GIF screenshots allowed.");
          return;
        }
        formData.append("bug_attachment", screenshot);
      }

      await api.post("bugs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onBugAdded) onBugAdded();
      onClose();
    } catch (err) {
      setError("Failed to create bug");
      console.error(err);
    }

  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full overflow-y-auto max-w-lg max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Bug</h2>
          <button
            onClick={onClose}
            className="p-2 bg-black text-white rounded-lg cursor-pointer transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Bug Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bug title"
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details here"
              rows={2}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
              </select>
            </div>
            <div className="w-1/2 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Assign Developer
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Developer</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name || dev.username}
                </option>
              ))}
            </select>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/png,image/gif"
              className="hidden"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              {screenshot && (
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt="Screenshot preview"
                  />
              )}
              <p className="mt-2 text-sm text-gray-600">
                Drop PNG/GIF file here or <span className="font-semibold text-blue-600">browser</span>
              </p>
            </div>
          </label>




          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Bug
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBugModal;