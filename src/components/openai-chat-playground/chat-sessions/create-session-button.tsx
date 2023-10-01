import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useChatSession } from "@/hooks/useChatSession";

export function CreateChatSessionButton() {
  const { handleCreateSession, createSessionMutation } = useChatSession();
  const handleCreateSessionOnServer = async () => {
    await handleCreateSession();
  };

  return (
    <>
      <Button
        type="button"
        variant={"default"}
        className="relative w-full"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleCreateSessionOnServer}
        disabled={createSessionMutation.isLoading}
      >
        {createSessionMutation.isLoading && (
          <div className="absolute left-5">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" fill="black" />
          </div>
        )}
        + Chat Session
      </Button>
    </>
  );
}
