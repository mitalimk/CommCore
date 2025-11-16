import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetRoomMessagesProps {
  roomId: Id<"discussionRooms">;
}

export const useGetRoomMessages = ({ roomId }: UseGetRoomMessagesProps) => {
  const data = useQuery(api.discussionRooms.getMessages, { roomId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
