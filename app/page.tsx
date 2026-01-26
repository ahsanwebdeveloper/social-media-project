"use client"; // Required for useSession

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to Home Page</h1>
      
      {session ? (
        <>
          <p className="text-lg text-gray-700">Signed in as {session.user?.email}</p>
          <button 
            onClick={() => signOut()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-700">You are not signed in</p>
          <button 
            onClick={() => signIn()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>
        </>
      )}
    </div>
  );
}