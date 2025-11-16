import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetRoomsProps {
  workspaceId: Id<"workspaces">;
}

export const useGetRooms = ({ workspaceId }: UseGetRoomsProps) => {
  const data = useQuery(api.discussionRooms.getByWorkspace, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
