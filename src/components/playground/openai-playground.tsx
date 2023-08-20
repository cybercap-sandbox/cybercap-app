import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import types from "next/types";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { useState } from "react";
import { Icons } from "../icons";
import { ModelSelector } from "./model-selector";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

export default function PlaygroundPage({ models }: { models: string[] }) {
  const [currentMode, setCurrentMode] = useState<
    "Complete" | "Insert" | "Edit"
  >("Complete");

  return (
    <>
      <div className=" h-full w-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">
            Playground | {currentMode} mode
          </h2>
        </div>
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className=" flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                  </HoverCard>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger
                      value="complete"
                      onClick={() => setCurrentMode("Complete")}
                    >
                      <span className="sr-only">Complete</span>
                      <Icons.complete />
                    </TabsTrigger>
                    <TabsTrigger
                      value="insert"
                      onClick={() => setCurrentMode("Insert")}
                    >
                      <span className="sr-only">Insert</span>
                      <Icons.insert />
                    </TabsTrigger>
                    <TabsTrigger
                      value="edit"
                      onClick={() => setCurrentMode("Edit")}
                    >
                      <span className="sr-only">Edit</span>
                      <Icons.edit />
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ModelSelector models={models} />
              </div>
              <div className="md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Write a tagline for an ice cream shop"
                      className="min-h-[400px] flex-1 p-4 md:min-h-[600px] "
                    />
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <Textarea
                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                        className="h-full min-h-[300px] lg:min-h-[600px]"
                      />
                      <div className="rounded-md border bg-muted"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className=" min-h-[400px] rounded-md border bg-muted lg:min-h-[600px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
