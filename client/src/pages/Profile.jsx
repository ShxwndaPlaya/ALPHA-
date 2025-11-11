import React, { useEffect, useState } from "react";
import ProfilePage from "@/components/Profile/ProfilePage";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        My Profile 👤
      </h1>
      {profile ? (
        <ProfilePage profile={profile} setProfile={setProfile} />
      ) : (
        <div className="text-gray-500 text-center py-10">
          Could not load your profile. Please try again later.
        </div>
      )}
    </div>
  );
}
