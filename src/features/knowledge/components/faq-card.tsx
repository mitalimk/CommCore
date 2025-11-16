"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpvoteFaq } from "../api/use-upvote-faq";
import { useDeleteFaq } from "../api/use-delete-faq";
import { toast } from "sonner";
import { useState } from "react";

interface FaqCardProps {
  faq: any;
}

export const FaqCard = ({ faq }: FaqCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: upvote, isPending: isUpvoting } = useUpvoteFaq();
  const { mutate: deleteFaq, isPending: isDeleting } = useDeleteFaq();

  const handleUpvote = () => {
    upvote(
      { faqId: faq._id },
      {
        onSuccess: () => {
          toast.success("Upvoted!");
        },
        onError: () => {
          toast.error("Failed to upvote");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq(
        { faqId: faq._id },
        {
          onSuccess: () => {
            toast.success("FAQ deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete FAQ");
          },
        }
      );
    }
  };

  return (
    <Card className={`${faq.isPinned ? "border-amber-400 border-2" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left"
          >
            <div className="flex items-start gap-2">
              {isExpanded ? (
                <ChevronUp className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
              )}
              <h3 className="font-semibold text-base">{faq.question}</h3>
            </div>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{faq.answer}</p>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-3">
              {faq.creator && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarImage src={faq.creator.user?.image} />
                    <AvatarFallback className="text-xs">
                      {faq.creator.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {faq.creator.user?.name}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={isUpvoting}
              className="h-8 gap-2"
            >
              <ThumbsUp className="size-4" />
              <span className="text-sm font-medium">{faq.upvotes}</span>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
