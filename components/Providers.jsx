"use client";

import { SessionProvider } from "next-auth/react";
import { IKContext } from "imagekitio-react";


export default function Providers({ children }) {

  return (
    <SessionProvider> 
        {children}
    </SessionProvider>
  );
}

