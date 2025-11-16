"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateFaq } from "../api/use-create-faq";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateFaqModal } from "../store/use-create-faq-modal";
import { toast } from "sonner";

export const CreateFaqModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateFaqModal();
  const { mutate, isPending } = useCreateFaq();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClose = () => {
    setOpen(false);
    setQuestion("");
    setAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    mutate(
      {
        question: question.trim(),
        answer: answer.trim(),
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("FAQ created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create FAQ");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New FAQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is your question?"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a detailed answer..."
              rows={6}
              disabled={isPending}
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create FAQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
