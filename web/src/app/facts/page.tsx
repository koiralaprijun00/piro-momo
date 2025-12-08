"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function FactsPage() {
  const router = useRouter()

  const facts = [
    "Feed every Nepali (30 million people) one plate of dal bhat every day for a year.",
    "Buy more than 7,000 apartments in Kathmandu.",
    "Build 42,720 rural schools across Nepal.",
    "Fly to Everest more than 534,000 times by helicopter.",
    "Buy 23,733 Toyota Hilux pickups.",
    "Plant over 42 million trees.",
    "Host 17,800 full-scale Nepali weddings.",
    "Buy over 2.1 million high-quality pashmina shawls."
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Facts about Binod's Money</h1>
      <ul className="list-disc list-inside space-y-3 text-gray-700">
        {facts.map((fact, index) =>
          <li key={index}>
            {fact}
          </li>
        )}
      </ul>
      <button onClick={() => router.push("/")} className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
        Back to Home
      </button>
    </div>
  )
}
