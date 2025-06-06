import { allowCorsFor } from "@deco/deco";
import { logger } from "@deco/deco/o11y";
import type { AppContext } from "site/apps/site.ts";
import { accounts } from "site/sdk/account.ts";
import type { Message, TextMessage } from "site/sdk/messages.ts";
import { getLocalThread, setLocalThread } from "site/sdk/messages.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
  threadMessages?: Message[];
}

export default async function aiResponse(
  props: Props,
  req: Request,
  ctx: AppContext,
) {
  // Allow Cors
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  const {
    message,
    threadId = "default",
    resourceId = "default",
    assistantUrl,
    threadMessages: initialThreadMessages = [],
  } = props;

  const threadMessages = initialThreadMessages.length > 0
    ? initialThreadMessages
    : getLocalThread(threadId);

  let assistant = ctx.assistant;

  if (!ctx.mcpServerURL) {
    logger.error("MCP server URL not found", props);
    throw new Error("MCP server URL not found");
  }

  if (!assistant?.agent) {
    logger.error("Assistant agent not found", props);
    throw new Error("Assistant agent not found");
  }

  const oldMessages = threadMessages
    .filter((message): message is TextMessage => message.role !== "tool")
    .map((message) =>
      `[${message.timestamp}] ${message.role}: ${message.content}`
    ).join("\n\n");

  const messageWithContext = `Today is ${new Date().toUTCString()} UTC

Current Thread Id: ${threadId}
Current Account Name: ${accounts.get(threadId)}

<old-messages>
${oldMessages}
</old-messages>

<new-message>
${message}
</new-message>
`.slice(0, 200000); // anthropic max tokens

  try {
    // Use the agent with the available tools, now with thread and resource IDs
    const response = await assistant.agent.stream(messageWithContext, {
      threadId,
      resourceId,
      maxSteps: 10,
      system: ctx.globalContext,
      onError: ({ error }) => {
        logger.error("Error streaming AI response", props, { error });
        console.error(error);
      },
      // @ts-ignore ignore
      tools: await listMCPTools(ctx.mcpServerURL!),
    });

    let fullResponse = "";
    for await (const part of response.fullStream) {
      switch (part.type) {
        case "error":
          logger.error("Error streaming AI response", props, {
            error: part.error,
          });
          console.error(part.error);
          throw new Error("Failed to process request");
        case "text-delta":
          fullResponse += part.textDelta;
          break;
      }
    }

    const updatedMessages = [...threadMessages.slice(-4)];
    if (fullResponse) {
      updatedMessages.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        role: "assistant",
        content: fullResponse,
        username: assistant.title,
      });
      setLocalThread(threadId, updatedMessages);
    }

    return { message: fullResponse };
  } catch (error) {
    console.error(error);
    return `I apologize, but I encountered an error processing your request.`;
  }
}
