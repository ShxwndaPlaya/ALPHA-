import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { api } from "@/utils/api";

export default function AvatarUpload({ currentAvatar }) {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const res = await api.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(res.data.avatarUrl);
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload avatar. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-28 h-28">
      <img
        src={avatar || "/default-avatar.png"}
        alt="User Avatar"
        className="w-full h-full object-cover rounded-full border-4 border-gray-200 dark:border-gray-700 shadow"
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow transition"
      >
        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
