import { CircleNotch } from "@phosphor-icons/react";
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
        data-cy={"createChatSessionButton"}
        type="button"
        variant={"default"}
        className="relative w-full"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleCreateSessionOnServer}
        disabled={chatSessionIsLoading}
      >
        {chatSessionIsLoading && (
          <div className="absolute left-5">
            <CircleNotch size={18} className="mr-2 animate-spin" />
          </div>
        )}
        {t("create-session-button")}
      </Button>
    </>
  );
}
