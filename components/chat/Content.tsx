import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import LoadingMessage from "site/components/chat/LoadingMessage.tsx";
import Message from "site/components/chat/Message.tsx";
import Icon from "site/components/ui/Icon.tsx";
import type { Assistant } from "site/sdk/assistants.ts";
import { isAiThinking, messages } from "site/sdk/messages.ts";
import type { ChatSuggestion } from "site/sections/Chat.tsx";

interface Props {
  iconColor: string;
  assistant: Assistant;
  pageTitle: string;
  pageSubtitle: string;
  suggestions: ChatSuggestion[];
}

export default function Content({
  assistant,
}: Props) {
  const autoScroll = useSignal(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container) return;

      const isAtBottom = container.scrollHeight - container.scrollTop <=
        container.clientHeight + 5;

      autoScroll.value = isAtBottom; // Ativa o auto-scroll se o usuário estiver no final
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  messages.subscribe(() => {
    if (!IS_BROWSER || !autoScroll.value) return;

    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) {
      loadingMessage.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <>
      <span class="flex justify-center items-center">
        <span class="size-full flex justify-center items-center p-2">
          <img src="https://lojawebcontinental.vtexassets.com/arquivos/logo-webcontinental-checkout.png" />
        </span>
      </span>
      {!IS_BROWSER
        ? (
          <div class="max-w-4xl mx-auto px-3 mb-8 flex justify-center items-center">
            <span class="text-primary loading loading-ring loading-lg" />
          </div>
        )
        : !messages.value.length
        ? (
          <>
            <div class="text-center">
              <h1 class="text-neutral-darkest text-2xl">
                Start chatting with {assistant.title}
              </h1>
              <p class="text-neutral-dark text-base">
                {assistant.description}
              </p>
            </div>
          </>
        )
        : (
          <div
            ref={containerRef}
            id="messages-container"
            class="w-full max-w-4xl mx-auto pb-3 pr-1 md:pr-3 space-y-2 overflow-y-auto"
          >
            {messages.value.map((message) => (
              <Message key={message.id} {...message} />
            ))}
            {isAiThinking.value && (
              <LoadingMessage
                username={assistant.title}
              />
            )}
          </div>
        )}
    </>
  );
}
