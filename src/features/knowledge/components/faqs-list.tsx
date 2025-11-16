"use client";

import { useGetFaqs } from "../api/use-get-faqs";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { FaqCard } from "./faq-card";
import { useCreateFaqModal } from "../store/use-create-faq-modal";

export const FaqsList = () => {
  const workspaceId = useWorkspaceId();
  const { data: faqs, isLoading } = useGetFaqs({ workspaceId });
  const [_open, setOpen] = useCreateFaqModal();

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
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <p className="text-sm text-muted-foreground">
            Ask questions and share answers with your team
          </p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="size-4 mr-2" />
          New FAQ
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!faqs || faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">No FAQs yet</p>
            <Button onClick={() => setOpen(true)}>Create your first FAQ</Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <FaqCard key={faq._id} faq={faq} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
