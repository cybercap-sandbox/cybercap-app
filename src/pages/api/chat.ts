/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export default async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, model } = await req.json();
  let response;

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    response = await openai.chat.completions.create({
      model: model,
      stream: true,
      messages,
    });
  } catch (error) {
    console.error(error);
    return null;
  }

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
