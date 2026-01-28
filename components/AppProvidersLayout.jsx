"use client"; 

import Providers from "./Providers";
import Header from "./Header";

export default function AppProvidersLayout({ children }) {
  return (
    <Providers>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </Providers>
  );
}
