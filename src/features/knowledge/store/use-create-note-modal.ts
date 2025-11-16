import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateNoteModal = () => {
  return useAtom(modalState);
};
