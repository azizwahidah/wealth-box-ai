"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { profiles } from "@/lib/profiles";
import ProfileSelector from "@/components/ProfileSelector";
import ProfileDetails from "@/components/ProfileDetails";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-violet-700">
              SoFi AI Financial Advisor
            </h1>
            <p className="text-sm text-gray-500">
              Personalized financial coaching powered by AI
            </p>
          </div>
          <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
            Demo
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Step 1: Profile Selection */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select a Financial Profile
          </h2>
          <ProfileSelector
            profiles={profiles}
            selectedId={selectedProfile?.id ?? null}
            onSelect={setSelectedProfile}
          />
        </section>

        {/* Step 2: Profile Details + Chat */}
        {selectedProfile && (
          <>
            <section>
              <ProfileDetails profile={selectedProfile} />
            </section>

            <section>
              <ChatInterface profile={selectedProfile} />
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>
            Demo project for SoFi AI Financial Planning Analyst role.
            Built with Next.js, Claude AI, and Tailwind CSS.
          </p>
          <p className="mt-1">
            This is a demonstration — not real financial advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
