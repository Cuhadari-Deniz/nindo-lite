import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function TriggerInfluencerUpdateButton(
  props: Omit<ComponentProps<"button">, "onClick">
) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateAllInfluencersMutation = useMutation(
    trpc.influencer.triggerUpdate.mutationOptions()
  );

  const onClick = async () => {
    await updateAllInfluencersMutation.mutateAsync();
    await queryClient.invalidateQueries(trpc.influencer.getAll.queryOptions());
  };

  return (
    <Button {...props} onClick={onClick}>
      Trigger Update All Influencers
    </Button>
  );
}
