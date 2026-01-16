"use client";
import { useEffect, useState } from "react";
import { User, FolderKanban, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { access } from "fs";
import { refresh } from "next/cache";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.get("auth/profile/")
      .then(res => {setUser(res.data);})
      .catch(() => setUser(null));
  }, []);

  const logoutHandler = async() => {
    try {
      const refresh =localStorage.getItem("refresh");
      if(refresh){
        await api.post("auth/logout/",{refresh})
      }
    } catch (error) {
      console.error("Logout APi error:", error)
    }
    
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setUser(null)
    router.push("/login")
  }
  return (
    <header className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center justify-between py-3 "> 
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gap-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0743 0V6.64465C21.3711 7.32038 24.7634 11.0369 24.7634 15.5417C24.7634 20.4971 20.6927 24.5514 15.7174 24.5514C10.9682 24.5514 7.1237 20.9475 6.67141 16.3301H0C0.452299 24.6641 7.23678 31.3087 15.7174 31.3087C24.4241 31.3087 31.4348 24.3262 31.4348 15.6544C31.4348 7.433 25.1026 0.788349 17.0743 0Z"
                  fill="#007DFA"
                />
                <path d="M15.2651 0H0V6.53203H15.2651V0Z" fill="#007DFA" />
                <path d="M11.7598 8.22144H0V14.8661H11.7598V8.22144Z" fill="#007DFA" />
              </svg>
            </div>
            <Link href="/dashboard">
              <span className="font-semibold text-xl text-gray-800">
                ManageBug
              </span>
            </Link>
          </div>

          <div className="md:flex gap-8 text-sm">
            <Link href="/dashboard" className="flex gap-2 text-gray-500 hover:text-blue-600">
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </Link>
            <Link href="/bugs" className="flex gap-2 text-gray-500 hover:text-blue-600">
              <Briefcase className="w-4 h-4" />
              <span>Bugs</span>
            </Link>
          </div>
          <div onClick={()=>setShowMenu(!showMenu)}
           className="flex items-center  px-3 py-1 gap-2 bg-gray-100 rounded-lg">
            <Link href="/profile">
              <button className="relative w-9 h-9 rounded-full bg-gray-300 flex items-center cursor-pointer justify-center">
                <User className="w-5 h-5 text-gray-600 hover:text-blue-400" />
              </button>
            </Link>

            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {user ? user.name || user.email : "Guest"}
            </span>
          </div>

            {showMenu && (
              <div className="absolute top-14 right-18 bg-white border rounded-lg">
                <button
                  onClick={logoutHandler}
                  className="px-3 py-1 font-bold text-red-500 cursor-pointer rounded"
                >
                  Logout
                </button>
              </div>
            )}
        </nav>
      </div>
    </header>
  );
}

