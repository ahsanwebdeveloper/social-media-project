"use client"

import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()

  return <h1 className="bg-green-500 text-white p-2 rounded">
  Username: {params.username}
</h1>

}
