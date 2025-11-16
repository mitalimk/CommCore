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
import { Switch } from "@/components/ui/switch";
import { useCreateRoom } from "../api/use-create-room";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateRoomModal } from "../store/use-create-room-modal";
import { toast } from "sonner";

export const CreateRoomModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateRoomModal();
  const { mutate, isPending } = useCreateRoom();

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
    setTopic("");
    setDescription("");
    setIsPrivate(false);
    setMaxMembers("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !topic.trim()) {
      toast.error("Room name and topic are required");
      return;
    }

    mutate(
      {
        name: name.trim(),
        topic: topic.trim(),
        description: description.trim() || undefined,
        workspaceId,
        isPrivate,
        maxMembers: maxMembers ? parseInt(maxMembers) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Room created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create room");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Discussion Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Planning"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Q1 2024 Strategy"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this room about?"
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Max Members (optional)</Label>
            <Input
              id="maxMembers"
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder="Leave empty for unlimited"
              disabled={isPending}
              min="2"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="private">Private Room</Label>
              <p className="text-xs text-muted-foreground">
                Only invited members can join
              </p>
            </div>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isPending}
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
              {isPending ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
