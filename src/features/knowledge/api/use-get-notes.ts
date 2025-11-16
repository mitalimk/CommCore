import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetNotesProps {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
}

export const useGetNotes = ({ workspaceId, channelId }: UseGetNotesProps) => {
  const data = useQuery(api.notes.getByWorkspace, { workspaceId, channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
