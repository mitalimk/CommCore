import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useUploadDocumentModal = () => {
  return useAtom(modalState);
};
