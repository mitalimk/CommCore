import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetFaqsProps {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
}

export const useGetFaqs = ({ workspaceId, channelId }: UseGetFaqsProps) => {
  const data = useQuery(api.faqs.getByWorkspace, { workspaceId, channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
