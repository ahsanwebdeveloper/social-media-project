"use client";

import { SessionProvider } from "next-auth/react";
import { IKContext } from "imagekitio-react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({ children }) {
  const authenticator = async () => {
    const res = await fetch("/api/imagekit-auth");
    if (!res.ok) {
      throw new Error("ImageKit auth failed");
    }
    return res.json();
  };

  return (
    <SessionProvider>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {children}
      </IKContext>
    </SessionProvider>
  );
}

