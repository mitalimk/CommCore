"use client";

import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X, Upload, File } from "lucide-react";
import { useUploadDocument } from "../api/use-upload-document";
import { useGenerateUploadUrl } from "../api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUploadDocumentModal } from "../store/use-upload-document-modal";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export const UploadDocumentModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useUploadDocumentModal();
  const { mutate: uploadDoc, isPending } = useUploadDocument();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setDescription("");
    setTagInput("");
    setTags([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();
      if (!uploadUrl) {
        toast.error("Failed to generate upload URL");
        return;
      }

      // Step 2: Upload file to Convex storage
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        toast.error("Failed to upload file");
        return;
      }

      const { storageId } = await uploadResult.json();

      // Step 3: Save document metadata
      uploadDoc(
        {
          name: file.name,
          fileId: storageId as Id<"_storage">,
          fileType: file.type,
          fileSize: file.size,
          workspaceId,
          description: description.trim() || undefined,
          tags,
        },
        {
          onSuccess: () => {
            toast.success("Document uploaded successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to save document");
          },
        }
      );
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>File *</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={isPending}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="flex-1"
              >
                <Upload className="size-4 mr-2" />
                {file ? file.name : "Choose File"}
              </Button>
            </div>
            {file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <File className="size-4 text-muted-foreground" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this document about?"
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add tags"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={isPending}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
