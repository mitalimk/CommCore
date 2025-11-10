"use client";

import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "../api/use-current-user";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <Loader className="size-4 animate-spin text-muted-foreground" />
    );
  }

  if (!data) {
    return null;
  }

  const { image, name, email } = data;
const displayName = name || email?.split("@")[0] || "User";
const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      {/* ✅ FIX: Use `asChild` to prevent nested <button> */}
      <DropdownMenuTrigger className="outline-name relative">
        <Avatar className=" rounded-md size-10 hover:opacity-75 transition">
         <AvatarImage className="rounded-md" alt={displayName} src={image} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>

        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
