import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateFaqModal = () => {
  return useAtom(modalState);
};
