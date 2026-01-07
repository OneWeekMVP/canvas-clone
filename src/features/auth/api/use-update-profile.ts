import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.users.profile["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.users.profile["$patch"]>["json"];

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.users.profile.$patch({ json });

      if (!response.ok) {
        const error = await response.json();
        throw new Error("error" in error ? error.error : "Failed to update profile");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};