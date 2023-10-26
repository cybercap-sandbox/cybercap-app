import { useTranslation } from "next-i18next";
import { CircleNotch, ArrowsClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function ChatPlaygroundWrapper({
  children,
  handleSubmitMessageFromUser,
  input,
  generationIsLoading,
  mutationIsLoading,
  stop,
  reload,
  reloadAvailable,
}: {
  children: React.ReactNode;
  handleSubmitMessageFromUser: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  generationIsLoading: boolean;
  mutationIsLoading: boolean;
  stop: () => void;
  reload: () => void;
  reloadAvailable: boolean;
}) {
  const { t } = useTranslation("chat-playground");

  return (
    <>
      <div className=" h-full w-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">
            {t("chat-playground-title")}
          </h2>
        </div>
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr]">
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleSubmitMessageFromUser}
            >
              {children}
              <div className="flex items-center space-x-2">
                <Button
                  data-cy={"submitChatPromptButton"}
                  disabled={
                    generationIsLoading ||
                    mutationIsLoading ||
                    input.length === 0
                  }
                  className="relative pl-10 pr-10"
                >
                  {(generationIsLoading || mutationIsLoading) && (
                    <div className="absolute left-4">
                      <CircleNotch size={18} className="animate-spin" />
                    </div>
                  )}
                  {t("submit-button")}
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={stop}
                  disabled={!generationIsLoading}
                >
                  {t("stop-button")}
                </Button>
                {reloadAvailable && (
                  <Button
                    variant={"secondary"}
                    onClick={reload}
                    disabled={generationIsLoading}
                  >
                    <ArrowsClockwise size={18} className="mr-2" />
                    {t("reload-button")}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
