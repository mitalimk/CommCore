import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  roomId: Id<"discussionRooms">;
  body: string;
  image?: Id<"_storage">;
};
type ResponseType = Id<"roomMessages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
};

export const useSendRoomMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);

  const isPending = useMemo(() => status === "pending", [status]);

  const mutation = useMutation(api.discussionRooms.sendMessage);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
      } finally {
        setStatus("settled");
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending };
};
