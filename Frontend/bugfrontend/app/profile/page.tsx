"use client";
import { useEffect, useState, ChangeEvent } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { User, Phone, Mail } from "lucide-react";

export default function ProfileSettings() {
  const [userData, setUserData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    api.get("auth/profile/")
      .then(res => {
        setUserData(res.data);
        if (res.data.role) {
          localStorage.setItem("role", res.data.role);
        }
      })
      
      .catch(() => alert("Failed to load profile"));
  }, []);
  
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((pre: any) => ({ ...pre, [field]: e.target.value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("mobile_number", userData.mobile_number);
      if (selectedImage) {
        formData.append("profile_images", selectedImage);
      } 
      const res = await api.patch(
        "auth/profile/update/",
        formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }
      );
      alert("Profile updated successfully");
      setUserData(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-3 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="w-full space-y-4">
          <div className="w-full mt-6 flex flex-col items-center space-y-4">
            {userData.profile_images_url && (
              <img
                src={userData.profile_images_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
            )}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="profileImageInput"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Upload profile
            </label>
          </div>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              value={userData.name || ""}
              onChange={handleInputChange("name")}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              name="mobile_number"
              value={userData.mobile_number || ""}
              onChange={handleInputChange("mobile_number")}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl"
              placeholder="Mobile Number"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={userData.email || ""}
              disabled
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl"
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={handleUpdate}
            className="py-4 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </main>
    </div>
  );
}
