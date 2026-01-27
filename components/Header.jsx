

"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") return null; 

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="font-bold text-xl">My App</h1>
      {session ? (
        <div className="flex items-center gap-2">
          <p>{session.user?.email}</p>
          <Button variant="contained" onClick={() => signOut()}>
            Sign Out
          </Button>
           <Link href="/uploadfile">Upload video</Link>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/uploadfile">Upload video</Link>
        </div>
      )}
    </header>
  );
}
