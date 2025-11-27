// "use client";

// import { Loader, LogOut } from "lucide-react";
// import { useAuthActions } from "@convex-dev/auth/react";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { useCurrentUser } from "../api/use-current-user";

// export const UserButton = () => {
//   const { signOut } = useAuthActions();
//   const { data, isLoading } = useCurrentUser();

//   if (isLoading) {
//     return (
//       <Loader className="size-4 animate-spin text-muted-foreground" />
//     );
//   }

//   if (!data) {
//     return null;
//   }

//   const { image, name, email } = data;
// const displayName = name || email?.split("@")[0] || "User";
// const avatarFallback = displayName.charAt(0).toUpperCase();

//   return (
//     <DropdownMenu modal={false}>
//       {/* ✅ FIX: Use `asChild` to prevent nested <button> */}
//       <DropdownMenuTrigger className="outline-name relative">
//         <Avatar className=" rounded-md size-10 hover:opacity-75 transition">
//          <AvatarImage className="rounded-md" alt={displayName} src={image} />
//         <AvatarFallback>{avatarFallback}</AvatarFallback>

//         </Avatar>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="center" side="right" className="w-60">
//         <DropdownMenuItem onClick={() => signOut()} className="h-10">
//           <LogOut className="size-4 mr-2" />
//           Log out
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

"use client";

import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "convex-dev/auth/react";
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
      <DropdownMenuTrigger asChild>
        <div className="relative group">
          <Avatar className="rounded-md size-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 group-hover:border-purple-400/40 transition">
            <AvatarImage
              className="rounded-md"
              alt={displayName}
              src={image}
            />
            <AvatarFallback className="text-sm font-semibold text-white bg-gradient-to-br from-gray-700 to-gray-800">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-md transition"></span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl bg-[#0d0d0d]/95 border border-white/10 backdrop-blur-md shadow-xl text-sm text-gray-200"
      >
        <div className="px-3 py-2 border-b border-white/10">
          <p className="font-semibold">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="h-10 text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 transition-colors"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
