/* eslint-disable @typescript-eslint/no-misused-promises */

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { i18n, useTranslation } from "next-i18next";
import { CircleNotch } from "@phosphor-icons/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sizeOptions = [
  { label: "256x256", value: "256x256" },
  { label: "512x512", value: "512x512" },
  { label: "1024x1024", value: "1024x1024" },
];
export const imgGenFormSchema = z.object({
  prompt: z.string().min(5, {
    message: i18n?.isInitialized
      ? i18n?.t("image-generation:prompt-length-error")
      : "",
  }),
  n: z.preprocess((a) => parseInt(z.string().parse(String(a)), 10), z.number()),
  size: z.enum(["256x256", "512x512", "1024x1024"]),
});

export function ImageGenerationPromptForm({
  submitHandler,
  isLoading,
}: {
  submitHandler: (values: z.infer<typeof imgGenFormSchema>) => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation("image-generation");

  // 1. Define your form.
  const form = useForm<z.infer<typeof imgGenFormSchema>>({
    resolver: zodResolver(imgGenFormSchema),
    defaultValues: {
      prompt: "",
      n: 1,
      size: "256x256",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof imgGenFormSchema>) {
    submitHandler(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        data-cy={"imageGenerationForm"}
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("prompt.label")}</FormLabel>
              <FormControl>
                <Input
                  data-cy={"imageGenerationPromptInput"}
                  placeholder={t("prompt.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("prompt.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="n"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("n.label")}</FormLabel>
              <FormControl>
                <Input
                  min={1}
                  max={10}
                  type={"number"}
                  placeholder={t("n.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("n.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("size.label")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("size.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("size.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="relative px-10"
          data-cy={"submitImageGenerationPromptButton"}
        >
          {isLoading && (
            <div className="absolute left-4">
              <CircleNotch size={18} className="animate-spin" />
            </div>
          )}
          {t("submit-button")}
        </Button>
      </form>
    </Form>
  );
}
