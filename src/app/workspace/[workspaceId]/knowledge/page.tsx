"use client";

import { KnowledgeHub } from "@/features/knowledge/components/knowledge-hub";
import { CreateNoteModal } from "@/features/knowledge/components/create-note-modal";
import { CreateFaqModal } from "@/features/knowledge/components/create-faq-modal";
import { UploadDocumentModal } from "@/features/knowledge/components/upload-document-modal";

const KnowledgePage = () => {
  return (
    <>
      <KnowledgeHub />
      <CreateNoteModal />
      <CreateFaqModal />
      <UploadDocumentModal />
    </>
  );
};

export default KnowledgePage;
