"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/class-merge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ModelSelector({
  modelsList,
  currentModel,
  setCurrentModel,
}: {
  modelsList: string[];
  currentModel?: string;
  setCurrentModel: (model: string) => void;
}) {
  const { t } = useTranslation("chat-playground");

  const [popoverOpen, setPopoverOpen] = React.useState(false);

  if (modelsList?.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="text-base font-semibold">{t("model-selector-title")}</h3>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full justify-between"
          >
            {currentModel
              ? modelsList.find((model) => model === currentModel)
              : "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" w-full p-0">
          <Command>
            <CommandInput placeholder="Search model..." />
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {modelsList.map((model) => (
                <CommandItem
                  key={model}
                  onSelect={(currentValue) => {
                    setCurrentModel(
                      currentValue === currentModel ? "" : currentValue
                    );
                    setPopoverOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentModel === model ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
