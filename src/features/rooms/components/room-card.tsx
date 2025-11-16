"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useJoinRoom } from "../api/use-join-room";
import { toast } from "sonner";

interface RoomCardProps {
  room: any;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate: joinRoom, isPending } = useJoinRoom();

  const handleJoinOrEnter = () => {
    if (room.isMember) {
      router.push(`/workspace/${workspaceId}/rooms/${room._id}`);
    } else {
      joinRoom(
        { roomId: room._id },
        {
          onSuccess: () => {
            toast.success("Joined room successfully");
            router.push(`/workspace/${workspaceId}/rooms/${room._id}`);
          },
          onError: () => {
            toast.error("Failed to join room");
          },
        }
      );
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{room.name}</h3>
              {room.isPrivate ? (
                <Lock className="size-4 text-muted-foreground" />
              ) : (
                <Globe className="size-4 text-muted-foreground" />
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {room.topic}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {room.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {room.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>{room.memberCount || 0}</span>
              {room.maxMembers && <span>/ {room.maxMembers}</span>}
            </div>
            {room.creator && (
              <div className="flex items-center gap-1.5">
                <Avatar className="size-5">
                  <AvatarImage src={room.creator.user?.image} />
                  <AvatarFallback className="text-xs">
                    {room.creator.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleJoinOrEnter}
            disabled={isPending}
            variant={room.isMember ? "outline" : "default"}
          >
            {room.isMember ? (
              <>
                Enter <ArrowRight className="size-4 ml-1" />
              </>
            ) : (
              "Join Room"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
