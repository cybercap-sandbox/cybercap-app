/* eslint-disable @typescript-eslint/no-misused-promises */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Icons } from "../icons";

const sizeOptions = [
  { label: "256x256", value: "256x256" },
  { label: "512x512", value: "512x512" },
  { label: "1024x1024", value: "1024x1024" },
];
export const imgGenFormSchema = z.object({
  prompt: z.string().min(5, {
    message: "Prompt must be at least 5 characters long",
  }),
  n: z.preprocess((a) => parseInt(z.string().parse(String(a)), 10), z.number()),
  size: z.enum(["256x256", "512x512", "1024x1024"]),
});

const formFields = {
  prompt: {
    name: "prompt",
    label: "Prompt",
    description: "The prompt to generate images from",
    placeholder: "A cute cat",
  },
  n: {
    name: "n",
    label: "Number of responses",
    description: "The number of images to generate",
    placeholder: "1",
  },
  size: {
    name: "size",
    label: "Image size",
    description: "The size of the generated images",
    placeholder: "Select an image size",
  },
};

export function ImageGenerationPromptForm({
  submitHandler,
  isLoading,
}: {
  submitHandler: (values: z.infer<typeof imgGenFormSchema>) => void;
  isLoading: boolean;
}) {
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("generateImg");

    submitHandler(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formFields.prompt.label}</FormLabel>
              <FormControl>
                <Input placeholder={formFields.prompt.placeholder} {...field} />
              </FormControl>
              <FormDescription>{formFields.prompt.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="n"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formFields.n.label}</FormLabel>
              <FormControl>
                <Input type={"number"} placeholder="1" {...field} />
              </FormControl>
              <FormDescription>{formFields.n.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formFields.size.label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={formFields.size.placeholder} />
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
              <FormDescription>{formFields.size.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading && <Icons.spinner className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
