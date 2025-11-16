"use client";

import { useGetRoomMessages } from "../api/use-get-room-messages";
import { useSendRoomMessage } from "../api/use-send-room-message";
import { Loader, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

interface RoomChatProps {
  roomId: Id<"discussionRooms">;
}

export const RoomChat = ({ roomId }: RoomChatProps) => {
  const { data: messages, isLoading } = useGetRoomMessages({ roomId });
  const { mutate: sendMessage, isPending } = useSendRoomMessage();
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    sendMessage(
      {
        roomId,
        body: message.trim(),
      },
      {
        onSuccess: () => {
          setMessage("");
        },
        onError: () => {
          toast.error("Failed to send message");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="flex items-start gap-3">
              <Avatar className="size-8">
                <AvatarImage src={msg.member?.user?.image} />
                <AvatarFallback>
                  {msg.member?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">
                    {msg.member?.user?.name || "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </span>
                </div>
                <p className="text-sm mt-1">{msg.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !message.trim()}
          >
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
