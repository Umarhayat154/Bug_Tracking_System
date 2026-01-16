  "use client";
  import { useRouter } from "next/navigation";
  import { useState, useEffect } from "react";
  import Navbar from "@/components/Navbar";
  import PageHeader from "@/components/PageHeader";
  import ProjectCard from "@/components/ProjectCard";
  import Pagination from "@/components/Pagination";
  import AddProjectModal from "@/components/AddProjectModel";
  import AddNewBugModal from "@/components/AddNewBugModel";
  import api from "@/lib/api";

  interface Project {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
    tasksDone?: number;
    totalTasks?: number;  
  }


  export default function Dashboard() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
      api.get("auth/profile/")
        .then(res => {
          setRole(res.data.role);
        })
        .catch(() => {
          setRole(null);
        });
    }, []);

      const fetchProjects = async () => {
        setLoading(true);  
        try {
          const res = await api.get("project/");
          setProjects(
            res.data.map((p: Project) => ({
              ...p,
              tasksDone: 0,
              totalTasks: 0,
            }))
            
          );
        } catch (error) {
          alert("Failed to load projects")
        } finally {
          setLoading(false)
        }

      }

      useEffect(()=>{
        fetchProjects();
      },[])

    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );

    const router=useRouter()
    const handleButtonClick = () => {
      if (role === "manager") setIsProjectModalOpen(true);
      if (role === "qa") setIsBugModalOpen(true);
    }; 

    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <PageHeader
          title="Visnext Software Solution"
          subtitle="Hi  , Welcome to ManageBug"
          Placeholder="Search for Projects here"
          buttonLabel={
            role === "manager"
              ? "+ Add New Project"
              : role === "qa"
                ? "+ Add New Bug"
                : ""
          }
          onInputChange={(value) => setSearch(value)}
          onButtonClick={handleButtonClick}
        />
        {role === "manager" && (
          <AddProjectModal
            isOpen={isProjectModalOpen}
            onClose={() => setIsProjectModalOpen(false)}
            onProjectAdded={fetchProjects}
          />
        )}
        
        {loading ? (
          <p className="text-center py-20">Loading projects...</p>
        ) : (
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasksDone={project.tasksDone || 0}
                totalTasks={project.totalTasks || 0}
                onClick={()=>router.push(`/projects/${project.id}/bugs`)}
              />
            ))}
          </div>
        )}


        {/* <div className="fixed bottom-0 left-0 w-full border-t border-gray-100 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={4}
              onPageChange={(page) => setCurrentPage(page)}
              entriesText="Showing 1 to 10 of 50 entries"
            />
          </div>
        </div> */}
      </div>
    );
  }
