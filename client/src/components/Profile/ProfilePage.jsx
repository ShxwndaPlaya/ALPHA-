import React, { useEffect, useState } from "react";
import AvatarUpload from "./AvatarUpload";
import Badges from "./Badges";
import { api } from "@/utils/api";
import { Trophy, Code2, MessageCircle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-center text-gray-500">
        Profile not found.
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-6">
        <AvatarUpload currentAvatar={profile.avatar} />
        <div className="mt-4 sm:mt-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {profile.username}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Level {profile.level} • {profile.xp} XP
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {profile.bio || "No bio added yet."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<Code2 size={20} />}
          label="Projects Shared"
          value={profile.stats?.projects || 0}
        />
        <StatCard
          icon={<MessageCircle size={20} />}
          label="Messages Sent"
          value={profile.stats?.messages || 0}
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Challenges Won"
          value={profile.stats?.challenges || 0}
        />
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Badges
        </h2>
        <Badges badges={profile.badges || []} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
      <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
        {value}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
