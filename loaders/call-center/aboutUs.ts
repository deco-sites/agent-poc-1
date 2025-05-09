import { AppContext } from "site/apps/site.ts";

/**
 * @name get_about_us
 * @description Get about us information
 */
export default async function loader(
  // deno-lint-ignore ban-types
  _props: {},
  _req: Request,
  _ctx: AppContext,
) {
  const res = await fetch("https://www.webcontinental.com.br/sobre-nos");
  const html = await res.text();

  const aboutUsMatch = html.match(
    /<p class="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--text__institucional">([\s\S]*?)<\/p>/,
  );
  let aboutUs = "";
  if (aboutUsMatch) {
    aboutUs = aboutUsMatch[1]
      .replace(/<br\s*\/?>(\s*)?/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  return { aboutUs };
}
