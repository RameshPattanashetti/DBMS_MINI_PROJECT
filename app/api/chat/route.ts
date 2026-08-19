import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: "You are a helpful banking assistant for BankManagement. Assist users politely with general questions, transaction guidance, and account features.",
    messages,
  });

  return result.toDataStreamResponse();
}