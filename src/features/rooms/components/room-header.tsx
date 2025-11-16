"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface RoomHeaderProps {
  roomId: Id<"discussionRooms">;
}

export const RoomHeader = ({ roomId }: RoomHeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const room = useQuery(api.discussionRooms.getById, { roomId });

  if (!room) {
    return (
      <div className="h-14 border-b flex items-center px-4">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/workspace/${workspaceId}/rooms`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-semibold">{room.name}</h1>
          <p className="text-xs text-muted-foreground">{room.topic}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Users className="size-4" />
          <span className="text-sm">{room.memberCount || 0}</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="size-4" />
        </Button>
      </div>
    </div>
  );
};
