"use client";

import { RoomsList } from "@/features/rooms/components/rooms-list";
import { CreateRoomModal } from "@/features/rooms/components/create-room-modal";

const RoomsPage = () => {
  return (
    <>
      <RoomsList />
      <CreateRoomModal />
    </>
  );
};

export default RoomsPage;
