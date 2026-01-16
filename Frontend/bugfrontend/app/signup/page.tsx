  "use client";

  import React, { useState} from "react";
  import { User, Mail, Lock, Repeat } from "lucide-react";
  import { useSearchParams } from "next/navigation";
  import { useRouter } from "next/navigation";
  import InputField from "@/components/InputField";
  import Link from "next/link";
  import publicApi from "@/lib/publicapi";
 

  export default function SignupForm() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmPassword] = useState(false)

    const router=useRouter()

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((pre) => ({ ...pre, [field]: e.target.value }))
    };
    
    const searchParams = useSearchParams();
    const Role = searchParams.get("role");

    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
      if(formData.password !== formData.confirmpassword){
        alert("password does not match please try again")
        return
      }
      try {
        const res =await publicApi.post("auth/register/",{
          name:formData.name,
          email:formData.email,
          password:formData.password,
          repeat_password:formData.confirmpassword,
          role:Role
        })
        if(res.status===201){
          alert("signup succesfully")
          router.push("/login")
        }
        
      } catch (error) {
        alert("signup failed")
      }
    };


    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:block w-1/2 h-full">
          <img
            src="/all.jpg"
            alt="signup graphic"
            className="w-full min-h-screen object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center mt-2">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
              <p className="text-gray-600">Please fill your information below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                icon={User}
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange("name")}
              />

              <InputField
                icon={Mail}
                type="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange("email")}
              />

              <InputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange("password")}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />
             
              <InputField
                icon={Lock}
                type={showConfirmedPassword ? "text" : "password"}
                placeholder="Enter Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange("confirmpassword")}
                showPassword={showConfirmedPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmedPassword)}
              />

              <button
                type="submit"
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-22 group"
              >
                Sign Up
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className="text-center mt-3 text-gray-800 flex justify-between">
              Already have an account?
              <Link href='/login' className="text-blue-600 font-medium hover:underline">
                Login to your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }



