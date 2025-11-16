"use client";

import { useGetDocuments } from "../api/use-get-documents";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { DocumentCard } from "./document-card";
import { useUploadDocumentModal } from "../store/use-upload-document-modal";

export const DocumentsList = () => {
  const workspaceId = useWorkspaceId();
  const { data: documents, isLoading } = useGetDocuments({ workspaceId });
  const [_open, setOpen] = useUploadDocumentModal();

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
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Share files and resources with your team
          </p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!documents || documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">No documents yet</p>
            <Button onClick={() => setOpen(true)}>Upload your first document</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
