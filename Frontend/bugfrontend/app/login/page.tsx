"use client";

import React, { useState } from "react";
import { Lock, Mail, } from "lucide-react";
import InputField from "@/components/InputField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import publicApi from "@/lib/publicapi";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pre) => ({ ...pre, [field]: e.target.value }))
  }


  const router=useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res =await publicApi.post("auth/token/",{
        email:formData.email,
        password:formData.password
      });

      const{access,refresh,role}=res.data
      localStorage.setItem("access",access);
      localStorage.setItem("refresh",refresh);
      localStorage.setItem("email",formData.email);
      localStorage.setItem("role",role);
      router.push("/dashboard")
    } catch (error) {
      alert("Invalid email or password")
    }
  }
  return (
    <div className="min-h-screen flex md:flex-row flex-col width w-full ">
      <div className="hidden h-full w-1/2 md:block">
        <img
          src = "/all.jpg"
          alt = "signup graphic"
          className = "w-full min-h-screen  object-cover"
        />
      </div>
      <div className = "w-full h-full md:w-1/2 flex flex-col mt-10 justify-center">
        <div className = "max-w-sm w-full mx-auto ">
          <div className = "mb-10 text-center md:text-left">
            <h1 className = "text-gray-800 font-bold text-3xl mb-4">Login</h1>
            <p className = "text-gray-500 text-sm">Please enter your login details</p>
          </div>
          <form onSubmit = {handleSubmit}>
            <InputField
              icon = {Mail}
              type = "email"
              placeholder = "Enter you Email Address"
              value = {formData.email}
              onChange = {handleChange('email')}
            />

            <InputField
              icon = {Lock}
              type = {showPassword ? "text" : "password"}
              value = {formData.password}
              placeholder = "Please Enter the password"
              onChange = {handleChange("password")}
              showPassword = {showPassword}
              togglePassword = {() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              className="w-1/2 mb-16 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-22 group"
            >
              Login
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
            Don't have an account account?
            <Link href='/signupselectrole' className="text-blue-600 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}