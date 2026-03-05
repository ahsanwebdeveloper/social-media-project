
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login"); // from "next/navigation"
  }

  return <div>Welcome, {session.user.username}</div>;
}