"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import BugTable from "@/components/BugTable";
import BugGrid from "@/components/BugGrid";
import AddNewBugModal from "@/components/AddNewBugModel";
import SearchBar from "@/components/SearchBar";

interface Project {
  id: number;
  name: string;
  description?: string;
  manager: number;
  logo_url?: string;
}

interface User {
  id: number;
  email: string;
  name?: string;
  role: "manager" | "qa" | "developer";
}

export default function ProjectBugsPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [bugs, setBugs] = useState([])
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("auth/profile/")
        setCurrentUser(res.data)
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`project/${projectId}/`)
        setProject(res.data)
      } catch (err) {
        console.error("Failed to fetch project:", err)
      }
    }
    
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchBugs = async () => {
    try {
      setLoading(true)
      setBugs([])
      const res = await api.get(`bugs/`)
      const filteredBugs=res.data.filter((b:any)=>{
        return b.project.toString()===projectId.toString();
      })
      const mapped = filteredBugs.map((b: any) => ({
        id: b.id.toString(),
        title: b.title,
        description: b.detail,
        status: b.status,
        type: b.type,
        dueDate: b.deadline,
        assignedTo: b.assignee ? [{
          name: b.assignee.name,
          avatar: b.assignee.profile_image || "/main.jpg"
        }] : [],
        attachmentUrl: b.bug_attachment_url
      })) 
      
      setBugs(mapped)
    } catch (err) {
      console.error("Failed to fetch bugs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchBugs()
    }
  }, [projectId])

  const handleBugAdded = () => {
    fetchBugs() 
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a href="/dashboard" className="hover:text-blue-600">Projects</a>
          <span>&gt;</span>
          <span className="text-gray-900">{project?.name || "Loading..."}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project?.name || "Project"} - Bugs
            </h1>
            <p className="text-gray-600 mt-1">
              {bugs.length} {bugs.length === 1 ? "bug" : "bugs"} found
            </p>
          </div>

          {currentUser?.role === "qa" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 font-bold text-white rounded-lg hover:bg-blue-700"
            >
              + Add New Bug
            </button>
          )}
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          assignedTo={["All"]}
          onAssignedChange={() => {}}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading bugs...</p>
            </div>
          ) : bugs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No bugs found in this project</p>
              {currentUser?.role === "qa" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Create your first bug
                </button>
              )}
            </div>
          ) : viewMode === "list" ? (
            <BugTable bugs={bugs} onBugUpdated={fetchBugs}/>
          ) : (
            <BugGrid bugs={bugs} />
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddNewBugModal
          projectId={projectId} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBugAdded={handleBugAdded}
        />
      )}
    </div>
  )
}