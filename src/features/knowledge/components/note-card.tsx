"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTogglePinNote } from "../api/use-toggle-pin-note";
import { useDeleteNote } from "../api/use-delete-note";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

interface NoteCardProps {
  note: any;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const { mutate: togglePin, isPending: isPinning } = useTogglePinNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const handleTogglePin = () => {
    togglePin(
      { noteId: note._id },
      {
        onSuccess: () => {
          toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
        },
        onError: () => {
          toast.error("Failed to update pin status");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(
        { noteId: note._id },
        {
          onSuccess: () => {
            toast.success("Note deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete note");
          },
        }
      );
    }
  };

  return (
    <Card className={`${note.isPinned ? "border-amber-400 border-2" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{note.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {note.creator && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-4">
                    <AvatarImage src={note.creator.user?.image} />
                    <AvatarFallback className="text-xs">
                      {note.creator.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {note.creator.user?.name}
                  </span>
                </div>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" />
                {format(new Date(note.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePin}
              disabled={isPinning}
              className="h-8 w-8 p-0"
            >
              <Pin
                className={`size-4 ${note.isPinned ? "fill-amber-500 text-amber-500" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {note.content}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
