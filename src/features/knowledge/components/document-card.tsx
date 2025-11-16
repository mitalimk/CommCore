"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteDocument } from "../api/use-delete-document";
import { toast } from "sonner";
import { format } from "date-fns";

interface DocumentCardProps {
  document: any;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const { mutate: deleteDoc, isPending } = useDeleteDocument();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDoc(
        { docId: document._id },
        {
          onSuccess: () => {
            toast.success("Document deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete document");
          },
        }
      );
    }
  };

  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, "_blank");
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="size-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{document.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(document.fileSize)} • {document.fileType}
            </p>
            {document.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {document.description}
              </p>
            )}
            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {document.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              {document.uploader && (
                <div className="flex items-center gap-1.5 flex-1">
                  <Avatar className="size-5">
                    <AvatarImage src={document.uploader.user?.image} />
                    <AvatarFallback className="text-xs">
                      {document.uploader.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(document.createdAt), "MMM dd")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-7 w-7 p-0"
                >
                  <Download className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
