  "use client";

  import { useEffect, useState } from "react";
  import Navbar from "@/components/Navbar";
  import Pagination from "@/components/Pagination";
  import SearchBar from "@/components/SearchBar";
  import BugTable,{Bug}from "@/components/BugTable";
  import AddNewBugModal from "@/components/AddNewBugModel";
  import BugGrid from "@/components/BugGrid";
  import api from "@/lib/api";

  export default function BugsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [assignedTo, setAssignedTo] = useState("All");
    const [bugs, setBugs] = useState<Bug[]>([]);  
    const [loading, setLoading] = useState(true);
    const mapBugResponse = (bug: any) => {
      return {
        id: bug.id,
        title: bug.title,
        description: bug.detail,
        status: bug.status,
        type: bug.type,
        dueDate: bug.deadline,
        assignedTo: bug.assignee
          ? [
            {
              name: bug.assignee.name,
              avatar: bug.assignee.profile_image || "/main.jpg",
            },
          ]
          : [],
        attachmentUrl: bug.bug_attachment_url,
      };
    };


    useEffect(() => {
      const fetchBugs = async () => {
        try {
          const res = await api.get("bugs/");
          const mapped = res.data.map((b: any) => mapBugResponse(b))
          setBugs(mapped)
        } catch (error) {
          console.error("Failed to fetch bugs", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBugs();
    }, []);

    const handleBugAdded = async () => {
      try {
        const res = await api.get("bugs/");
        const mapped = res.data.map((b: any) => mapBugResponse(b))
        setBugs(mapped)
        setIsTaskOpen(false)
      } catch (error) {
        console.error("Failed to refresh bugs", error);
      }
    };


    return (
      <div className="min-h-screen bg-white pb-32">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <span>Projects</span>
                <span>&gt;</span>
                <span>All project Bugs</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">All bugs listing</h1>
                <span className="px-2 py-0.5 bg-red-50 text-red-400 text-[10px] font-bold rounded uppercase">
                  Bugs
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsTaskOpen(true)}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              + New Task bug
            </button>
          </div>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            assignedTo={["All", "Ali", "Sara", "Ahmed"]}
            onAssignedChange={(val) => setAssignedTo(val)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="mt-8">
            {loading ? (
              <p className="text-gray-500">Loading bugs...</p>
            ) : viewMode === "list" ? (
              <BugTable bugs={bugs} />
            ) : (
              <BugGrid bugs={bugs} />
            )}
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                entriesText={`Showing 1 to 10 of 50 entries`}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
