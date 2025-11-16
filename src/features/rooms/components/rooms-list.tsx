"use client";

import { useGetRooms } from "../api/use-get-rooms";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { RoomCard } from "./room-card";
import { useCreateRoomModal } from "../store/use-create-room-modal";

export const RoomsList = () => {
  const workspaceId = useWorkspaceId();
  const { data: rooms, isLoading } = useGetRooms({ workspaceId });
  const [_open, setOpen] = useCreateRoomModal();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Discussion Rooms</h1>
          <p className="text-sm text-muted-foreground">
            Join focused conversations on specific topics
          </p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          New Room
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!rooms || rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">No rooms yet</p>
            <Button onClick={() => setOpen(true)}>Create your first room</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
