"use client";

import { UserProfile } from "@/lib/types";

interface ProfileSelectorProps {
  profiles: UserProfile[];
  selectedId: string | null;
  onSelect: (profile: UserProfile) => void;
}

export default function ProfileSelector({
  profiles,
  selectedId,
  onSelect,
}: ProfileSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          onClick={() => onSelect(profile)}
          className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
            selectedId === profile.id
              ? "border-violet-500 bg-violet-50 shadow-md"
              : "border-gray-200 bg-white hover:border-violet-300"
          }`}
        >
          <div className="text-3xl mb-2">{profile.emoji}</div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {profile.name}
          </h3>
          <p className="text-sm text-violet-600 font-medium">
            {profile.occupation}
          </p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {profile.shortBio}
          </p>
        </button>
      ))}
    </div>
  );
}
