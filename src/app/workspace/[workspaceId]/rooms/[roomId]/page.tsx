"use client";

import { useParams } from "next/navigation";
import { RoomChat } from "@/features/rooms/components/room-chat";
import { RoomHeader } from "@/features/rooms/components/room-header";
import { Id } from "../../../../../convex/_generated/dataModel";

const RoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as Id<"discussionRooms">;

  return (
    <div className="h-full flex flex-col">
      <RoomHeader roomId={roomId} />
      <div className="flex-1">
        <RoomChat roomId={roomId} />
      </div>
    </div>
  );
};

export default RoomPage;
