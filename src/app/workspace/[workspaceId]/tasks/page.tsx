"use client";

import { TaskBoard } from "@/features/tasks/components/task-board";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";

const TasksPage = () => {
  return (
    <>
      <TaskBoard />
      <CreateTaskModal />
    </>
  );
};

export default TasksPage;
