import { allowCorsFor } from "@deco/deco";
import { logger } from "@deco/deco/o11y";
import type { AppContext } from "site/apps/site.ts";
import type { Message, TextMessage } from "site/sdk/messages.ts";
import { listMCPTools } from "site/sdk/tools.ts";

export interface Props {
  assistantUrl: string;
  message: string;
  threadId?: string;
  resourceId?: string;
  threadMessages?: Message[];
}

interface StreamResponse {
  type: "text-delta" | "tool-call" | "tool-result" | "error";
  content: string;
}

export default function stream(
  props: Props,
  req: Request,
  ctx: AppContext,
): AsyncIterableIterator<StreamResponse> {
  // Allow Cors
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });
  const {
    message,
    threadId = "default",
    resourceId = "default",
    threadMessages = [],
  } = props;

  const assistant = ctx.assistant;
  if (!assistant) {
    logger.error("Assistant not found", props);
    throw new Error("Assistant not found");
  }

  if (!ctx.mcpServerURL) {
    logger.error("MCP server URL not found", props);
    throw new Error("MCP server URL not found");
  }

  if (!assistant.agent) {
    logger.error("Assistant agent not found", props);
    throw new Error("Assistant agent not found");
  }

  const oldMessages = threadMessages
    .filter((message): message is TextMessage => message.role !== "tool")
    .map((message) =>
      `[${message.timestamp}] ${message.role}: ${message.content}`
    ).join("\n\n");

  const messageWithContext = `
Today is ${new Date().toUTCString()} UTC

Current Thread Id: ${threadId}
Current Account Name: lojawebcontinental
Current Domain: www.webcontinental.com.br
If the user asks for a url from the site, you need to return the url of with the domain of the site.

<old-messages>
${oldMessages}
</old-messages>

<new-message>
${message}
</new-message>
`.slice(0, 200000); // anthropic max tokens

  const stream = (async function* () {
    const tools = await listMCPTools(ctx.mcpServerURL!);

    const agentStream = await assistant.agent!.stream(
      messageWithContext,
      {
        threadId,
        resourceId,
        maxSteps: 10,
        system: ctx.globalContext,
        onError: ({ error }) => {
          logger.error("Error streaming AI response: ${message}", { error });
          console.error(error);
        },
        // @ts-ignore ignore
        tools,
      },
    );

    for await (const part of agentStream.fullStream) {
      if (part.type === "error") {
        logger.error("Error streaming AI response: ${message}", {
          error: part.error,
        });
        console.error(part.error);
        yield {
          type: "error" as const,
          content: part.error instanceof Error
            ? part.error.message
            : "An error occurred while streaming the AI response",
        };
      }

      if (part.type === "text-delta") {
        yield {
          type: "text-delta" as const,
          content: part.textDelta,
        };
      }

      if (part.type === "tool-call") {
        yield {
          type: "tool-call" as const,
          content: part.toolName,
        };
      }

      if (part.type === "tool-result") {
        yield {
          type: "tool-result" as const,
          content: part.toolName,
        };
      }
    }
  })();

  return stream;
}
