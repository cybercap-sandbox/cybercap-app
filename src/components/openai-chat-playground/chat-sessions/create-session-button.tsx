import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useChatSession } from "@/hooks/useChatSession";
import { useTranslation } from "react-i18next";

export function CreateChatSessionButton() {
  const { handleCreateSession, chatSessionIsLoading } = useChatSession();
  const handleCreateSessionOnServer = async () => {
    await handleCreateSession();
  };
  const { t } = useTranslation("chat-playground");
  return (
    <>
      <Button
        type="button"
        variant={"default"}
        className="relative w-full"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleCreateSessionOnServer}
        disabled={chatSessionIsLoading}
      >
        {chatSessionIsLoading && (
          <div className="absolute left-5">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" fill="black" />
          </div>
        )}
        {t("create-session-button")}
      </Button>
    </>
  );
}
