import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  // Determine the correct href based on the id
  let href = `/workspace/${workspaceId}`;
  
  // ✅ NEW: Handle new feature routes
  if (id === "tasks") {
    href = `/workspace/${workspaceId}/tasks`;
  } else if (id === "knowledge") {
    href = `/workspace/${workspaceId}/knowledge`;
  } else if (id === "rooms") {
    href = `/workspace/${workspaceId}/rooms`;
  } else if (id !== "threads" && id !== "drafts") {
    // Existing channel/member routes
    href = `/workspace/${workspaceId}/channel/${id}`;
  }

  return (
    <Button
      variant="transparent"
      size="sm"
      asChild
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link href={href}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
