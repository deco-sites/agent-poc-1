import { SectionProps } from "@deco/deco";
import { getCookies, setCookie } from "@std/http";
import { AppContext } from "site/apps/site.ts";
import Content from "site/components/chat/Content.tsx";
import Input from "site/components/chat/Input.tsx";
import { previewAssistants } from "site/sdk/assistants.ts";
import Icon from "../components/ui/Icon.tsx";

export interface ChatSuggestion {
  /**
   * @title Sugestão
   */
  text: string;
}

export interface Props {
  /**
   * @title Cor do ícone
   */
  iconColor: string;
  /**
   * @title Título da página
   */
  pageTitle: string;
  /**
   * @title Subtítulo da página
   */
  pageSubtitle: string;
  /**
   * @title Sugestões
   * @description Lista de sugestões para iniciar a conversa
   */
  suggestions: ChatSuggestion[];
}

export function loader(props: Props, req: Request, ctx: AppContext) {
  const {
    // @ts-ignore ignore
    agent: _agent,
    ...assistant
  } = ctx.assistant;

  const cookies = getCookies(req.headers);

  const threadIdKey = `threadId-${assistant.url.replaceAll("/", "-")}`;
  const threadId = cookies[threadIdKey] || crypto.randomUUID();
  const resourceId = cookies["resourceId"] || crypto.randomUUID();

  if (!cookies[threadIdKey]) {
    setCookie(ctx.response.headers, {
      name: threadIdKey,
      value: threadId,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  if (!cookies["resourceId"]) {
    setCookie(ctx.response.headers, {
      name: "resourceId",
      value: resourceId,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return {
    ...props,
    assistant,
    threadId,
    resourceId,
  };
}

export default function Chat({
  iconColor,
  pageTitle,
  pageSubtitle,
  suggestions,
  assistant,
  threadId,
  resourceId,
}: SectionProps<typeof loader>) {
  if (!assistant) {
    return <div>Assistant not found</div>;
  }

  return (
    <div
      class="min-h-screen flex bg-white"
      style={{
        backgroundImage: "url(/background-gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main Content */}
      <div class="px-4 w-full pt-4">


        {/* Main Content Area */}
        <main class="flex flex-col items-center gap-4 w-full h-[calc(100vh-52px)]">
          <Content
            iconColor={iconColor}
            assistant={assistant}
            pageTitle={pageTitle}
            pageSubtitle={pageSubtitle}
            suggestions={suggestions}
          />
          <div class="mt-auto pb-4 w-full flex justify-center">
            <Input
              placeholder="Type your message here..."
              assistant={assistant}
              threadId={threadId}
              resourceId={resourceId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export function Preview() {
  return (
    <Chat
      assistants={previewAssistants}
      threadId={crypto.randomUUID()}
      resourceId="default"
      assistant={previewAssistants[0]}
      iconColor="#f91880"
      pageTitle="Start chatting with Product Creator"
      pageSubtitle="Ask questions or get help with your VTEX store"
      suggestions={[
        { text: "Create a new product listing for me" },
        { text: "Help me optimize my product pricing" },
        { text: "What information should I include in my product specs?" },
      ]}
    />
  );
}
