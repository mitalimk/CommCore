import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetTasksProps {
  workspaceId: Id<"workspaces">;
}

export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  const data = useQuery(api.tasks.getByWorkspace, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
