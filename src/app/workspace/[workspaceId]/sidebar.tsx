import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import Home from "@/app/page";
import { Bell, HomeIcon, MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";



export const Sidebar = () => {
    const pathname= usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#0a0a0a] flex flex-col items-center gap-y-4 pt-[9px] pb-4">
      {/* TOP section */}
      <WorkspaceSwitcher />
      <SidebarButton icon={HomeIcon} label="Home" isActive={pathname.includes("/workspace")}    />
       <SidebarButton icon={MessagesSquare} label="DMs" />
        <SidebarButton icon={Bell} label="Activity"  />
         <SidebarButton icon={MoreHorizontal} label="More" />
          
       
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div> 
    </aside>
  );
};
