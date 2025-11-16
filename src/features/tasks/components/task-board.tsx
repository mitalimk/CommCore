"use client";

import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { TaskCard } from "./task-card";
import { useCreateTaskModal } from "../store/use-create-task-modal";

type TaskStatus = "not_started" | "in_progress" | "completed" | "delayed";

const STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "bg-slate-100" },
  in_progress: { label: "In Progress", color: "bg-blue-100" },
  completed: { label: "Completed", color: "bg-green-100" },
  delayed: { label: "Delayed", color: "bg-red-100" },
};

export const TaskBoard = () => {
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading } = useGetTasks({ workspaceId });
  const [_open, setOpen] = useCreateTaskModal();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

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
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage team tasks efficiently
          </p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => {
              const statusTasks = getTasksByStatus(status);
              return (
                <div key={status} className="flex flex-col">
                  <div
                    className={`${STATUS_CONFIG[status].color} p-3 rounded-t-lg border-b-2`}
                  >
                    <h3 className="font-semibold text-sm flex items-center justify-between">
                      {STATUS_CONFIG[status].label}
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full">
                        {statusTasks.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex-1 bg-muted/20 p-2 rounded-b-lg space-y-2 min-h-[400px]">
                    {statusTasks.map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
