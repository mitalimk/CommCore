"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex-helpers/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex}>
      {children}
    </ConvexProviderWithAuth>
  );
}
