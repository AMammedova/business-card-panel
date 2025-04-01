"use client";

import ReactQueryProvider from "./QueryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
