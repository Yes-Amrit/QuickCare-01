"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIHelpPage() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Help</h1>
      <div className="flex justify-center">
      <div className="flex justify-center gap-6 mb-8">
          <Link
            href="/appointment"
            className="animate-button relative group px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-blue-200/50 hover:shadow-xl"
          >
            <span className="relative z-10">Book Your Appointment</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/Onlinepharmacy"
            className="animate-button relative group px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-green-200/50 hover:shadow-xl"
          >
            <span className="relative z-10">Buy Medicine</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
        <div className="w-full max-w-3xl aspect-video">
          <iframe
            src="https://app.dante-ai.com/embed/?kb_id=f915a2a9-d3d4-411a-a165-af28dc7b22ba&token=84bee53a-0a63-454b-b18d-0de7705f161d&modeltype=gpt-4-omnimodel-mini&tabs=false"
            allow="clipboard-write; clipboard-read; *;microphone *"
            className="w-full h-full"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
