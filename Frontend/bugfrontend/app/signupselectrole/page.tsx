"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User,UserCheck, Code2 } from "lucide-react";
import RoleCard from "@/components/RoleCard";

export default function SignupSelectRole() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setTimeout(() => {
      router.push(`/signup?role=${roleId}`)
    }, 300);
  };
  const roles = [
    {
      id: "manager",
      icon: User,
      title: "Manager",
      description: "Signup as a manager to manage the tasks and bugs",
    },
    {
      id: "developer",
      icon: Code2,
      title: "Developer",
      description:
        "Signup as a Developer to assign the relevant task to QA",
    },
    {
      id: "qa",
      icon: UserCheck,
      title: "QA",
      description:
        "Signup as a QA to create the bugs and report in tasks",
    },
   
  ];

  return (
    <div className = "h-screen w-full flex">
      <div className = "hidden md:block w-1/2 h-full">
        <img
          src = "/all.jpg"
          alt = "signup graphic"
          className = "w-full h-full object-cover"
        />
      </div>

      <div className = "w-full md:w-1/2 px-10 flex flex-col justify-center">
        <div className = "text-right mb-10">
          <span className = "text-gray-500">Already have an account? </span>
          <Link href="/login" className = "text-blue-500 hover:underline font-medium">
            Sign In
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Join Us!</h1>
            <p className="text-gray-500">To begin this journey, tell us what type of account you'd be opening.</p>
          </div>
          <div className="space-y-2">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                icon={role.icon}
                title={role.title}
                description={role.description}
                selected={selectedRole === role.id}
                onClick={() => handleRoleSelect(role.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
