import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateTaskModal = () => {
  return useAtom(modalState);
};
