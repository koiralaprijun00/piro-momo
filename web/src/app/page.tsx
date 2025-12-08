import { redirect } from "next/navigation"
import { Suspense } from "react"

// Root page component that handles the redirect
function RootPageContent() {
  redirect("/")
  return null // This will never be rendered due to the redirect
}

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootPageContent />
    </Suspense>
  )
}