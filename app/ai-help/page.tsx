"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AIHelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Help</h1>

      {/* Buttons Container */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
        <Link
          href="/appointment"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Book Your Appointment
        </Link>

        <Link
          href="/Onlinepharmacy"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Buy Medicine
        </Link>
      </div>

      {/* AI Chatbot */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl aspect-video rounded-lg shadow-md">
          <iframe
            src="https://app.dante-ai.com/embed/?kb_id=f915a2a9-d3d4-411a-a165-af28dc7b22ba&token=84bee53a-0a63-454b-b18d-0de7705f161d&modeltype=gpt-4-omnimodel-mini&tabs=false"
            allow="clipboard-write; clipboard-read; *;microphone *"
            className="w-full h-full rounded-lg"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
