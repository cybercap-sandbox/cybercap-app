import { useTranslation } from "next-i18next";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function ChatPlaygroundWrapper({
  children,
  handleSubmitMessageFromUser,
  input,
  isLoading,
  stop,
}: {
  children: React.ReactNode;
  handleSubmitMessageFromUser: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
  stop: () => void;
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
                <Button disabled={isLoading || input.length === 0}>
                  {isLoading && <Icons.spinner className="animate-spin" />}
                  {t("submit-button")}
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={stop}
                  disabled={!isLoading}
                >
                  {t("stop-button")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
