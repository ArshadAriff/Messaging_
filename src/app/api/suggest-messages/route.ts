import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages: convertToCoreMessages(messages),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      console.error("An unexpected erroro occured", error);
      throw error;
    }
  }
}

//----------------------------------------------------------
// import { openai } from "@ai-sdk/openai"; // Correct import from Vercel AI SDK
// import { streamText } from "ai"; // Correct import for streaming
// import { NextResponse } from "next/server";

// export const runtime = "edge"; // Ensure you're using the 'edge' runtime for streaming support

// export async function POST(req: Request) {
//   try {
//     // Define the prompt for the model
//     const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

//     // Parse the JSON body from the request if you're using user-provided messages
//     const { messages } = await req.json();

//     // Make a streaming request to OpenAI using the correct model and prompt
//     const response = await streamText({
//       model: "gpt-4-turbo", // Ensure you're using a valid model name
//       messages, // Pass messages if needed (convert them beforehand if required)
//       prompt, // Use the prompt directly
//       stream: true, // Enable streaming response
//     });

//     // Return the streamed response directly
//     return new Response(response, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   } catch (error) {
//     // Handle OpenAI API-specific errors
//     if (error instanceof openai.errors.APIError) {
//       const { name, status, headers, message } = error;
//       return NextResponse.json(
//         {
//           name,
//           status,
//           headers,
//           message,
//         },
//         { status }
//       );
//     } else {
//       // Handle any other unexpected errors
//       console.error("An unexpected error occurred:", error);
//       return NextResponse.json(
//         { error: "An unexpected error occurred" },
//         { status: 500 }
//       );
//     }
//   }
// }
