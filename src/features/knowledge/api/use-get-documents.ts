import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDocumentsProps {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
}

export const useGetDocuments = ({ workspaceId, channelId }: UseGetDocumentsProps) => {
  const data = useQuery(api.documents.getByWorkspace, { workspaceId, channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
