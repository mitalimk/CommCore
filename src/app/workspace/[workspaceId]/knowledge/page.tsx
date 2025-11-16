"use client";

import { KnowledgeHub } from "@/features/knowledge/components/knowledge-hub";
import { CreateNoteModal } from "@/features/knowledge/components/create-note-modal";
import { CreateFaqModal } from "@/features/knowledge/components/create-faq-modal";

const KnowledgePage = () => {
  return (
    <>
      <KnowledgeHub />
      <CreateNoteModal />
      <CreateFaqModal />
    </>
  );
};

export default KnowledgePage;
