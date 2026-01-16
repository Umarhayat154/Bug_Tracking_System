"use client";

import React, { useEffect, useState } from 'react';
import { X, Calendar, Image as ImageIcon, UploadCloud, ChevronDown,Paperclip } from 'lucide-react';
import api from "@/lib/api" 

interface BugDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onBugUpdated?: () => void;
  bugData: {
    id: string;
    title: string;
    description?: string;
    status: string;
    type: 'feature' | 'bug';
    createdAt: string;
    assignedTo?: { name: string, avatar: string }[]
    attachmentUrl?: string;
  };
}

const BugDetailModel:React.FC<BugDetailProps>= ({ isOpen, onClose, onBugUpdated, bugData })=>{
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [status, setStatus] = useState(bugData.status);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);  
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("auth/profile/");
        setCurrentUser(res.data)
      } catch (error) {
        console.error("failed to fetch user", error)
      }
    }
    fetchUser();
  }, [])

  const canUpdateStatus = () => {
    return currentUser?.role === "developer";
  }

  const getStatusOptions = () => {
    return bugData.type === "feature" ? ["new", "started", "completed"] : ["new", "started", "resolved"]
  }

  const handleFileChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(!file) return; 

    if (!["image/png", "image/gif"].includes(file.type)) {
      setError("Only PNG or GIF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setError("");
  }

   const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };  

  const handleStatusUpdate = async () => {
    if (status === bugData.status && !screenshot) {
      setError("NO Changes to Update");
      return;
    }
    setUpdating(true)
    setError("");

    try {
      const formData = new FormData();
      formData.append("status",status); 

       if (screenshot) {
        formData.append("bug_attachment", screenshot);
      }
      await api.patch(`bugs/${bugData.id}/`, formData,{
        headers:{
          "Content-Type": "multipart/form-data",
        }
      });

      if (onBugUpdated) onBugUpdated();
      onClose();
    } catch (err: any) {
      console.error("Failed to update status:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 403) {
        setError("You don't have permission to update this bug");
      } else {
        setError("Failed to update status");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !bugData) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-[16px] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 p-2 bg-black text-white rounded-lg cursor-pointer transition-all hover:bg-gray-800 z-10"
        >
          <X size={20} />
        </button>


        <div className="overflow-y-auto p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="flex items-center gap-3 bg-[#EEF2FF] text-[#4F46E5] px-5 py-2.5 rounded-2xl font-semibold w-fit">
              <span className="capitalize">{status}</span>
              {canUpdateStatus() && <ChevronDown size={18} />}
            </div>

            <div className="flex items-center gap-4 text-gray-400 mt-3 sm:mt-0">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-300">CREATED</p>
                <p className="text-sm font-semibold text-gray-500">
                  {bugData.createdAt || "N/A"}
                </p>
              </div>
              <div className="p-3 border border-gray-100 rounded-2xl bg-red-50/50">
                <Calendar size={22} />
              </div>
            </div>
          </div>


          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
            {bugData.title}
          </h1>

          {canUpdateStatus() && (
            <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Update Bug Status & Screenshot
              </label>
              
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {getStatusOptions().map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-2">
                  Add/Update Screenshot (Optional)
                </label>
                
                {screenshotPreview ? (
                  <div className="relative border-2 border-gray-300 rounded-lg p-3">
                    <img
                      src={screenshotPreview}
                      alt="New screenshot"
                      className="max-h-40 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {screenshot?.name}
                    </p>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/png,image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <Paperclip size={24} className="text-gray-400 mb-1" />
                      <p className="text-sm text-gray-600">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG or GIF only • Max 5MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
              
              <button
                onClick={handleStatusUpdate}
                disabled={updating || (status === bugData.status && !screenshot)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? "Updating..." : "Update Bug"}
              </button>

              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {bugData.attachmentUrl ? "Current Screenshot" : "No Screenshot"}
            </label>
            
            {bugData.attachmentUrl ? (
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={bugData.attachmentUrl}
                  alt="Bug screenshot"
                  className="w-full max-h-96 object-contain bg-gray-50"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 min-h-120px flex flex-col items-center justify-center">
                <div className="p-2 bg-white rounded-3xl shadow-sm mb-2">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-bold text-sm">No screenshot attached</p>
                <p className="text-xs text-gray-400 mt-1 italic">
                  Only PNG or GIF allowed
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-lg font-bold tracking-normal text-gray-900 block mb-2">
              Bug Details
            </label>
            <div className="w-full p-5 border border-gray-300 rounded-[24px] bg-white min-h-[110px] shadow-sm text-gray-600">
              {bugData.description || "No description provided."}
            </div>
          </div>

          {bugData.assignedTo && bugData.assignedTo.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 block mb-2">
                Assigned To
              </label>
              <div className="flex items-center gap-3">
                {bugData.assignedTo.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center text-gray-400 gap-2">
              <UploadCloud className="text-gray-400" size={20} />
              <p className="text-sm text-gray-500">
                {canUpdateStatus() 
                  ? "You can update screenshot above" 
                  : "Only developer can update screenshot"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetailModel;