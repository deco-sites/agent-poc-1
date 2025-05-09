import { AppContext } from "site/apps/site.ts";

/**
 * @name get_frequently_asked_questions
 * @description Get frequently asked questions
 */
export default async function loader(
  // deno-lint-ignore ban-types
  _props: {},
  _req: Request,
  _ctx: AppContext,
) {
  const result = await (await fetch(
    "https://www.webcontinental.com.br/faq?__pickRuntime=extensions&__device=desktop",
  )).json() as {
    extensions: Record<
      string,
      { content: { questions: Record<string, string> } }
    >;
  };
  const questions =
    Object.values(result.extensions).find((item) => "questions" in item.content)
      ?.content.questions ?? [];

  return { questions };
}
