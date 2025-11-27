"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithAuth } from "convex-helpers/react/auth";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return(  <ConvexProviderWithAuth client={convex}>
    {children}
    </ConvexProviderWithAuth>
    );
};
