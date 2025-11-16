"use client";

import { useParams } from "next/navigation";
import { RoomChat } from "@/features/rooms/components/room-chat";
import { Id } from "../../../../../convex/_generated/dataModel";

const RoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as Id<"discussionRooms">;

  return <RoomChat roomId={roomId} />;
};

export default RoomPage;
