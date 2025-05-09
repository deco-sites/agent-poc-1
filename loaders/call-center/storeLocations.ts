import { AppContext } from "site/apps/site.ts";

/**
 * @name get_store_locations
 * @description Get store locations information
 */
export default async function loader(
  // deno-lint-ignore ban-types
  _props: {},
  _req: Request,
  _ctx: AppContext,
) {
  const url = "https://www.webcontinental.com.br/sobre-nos";
  const res = await fetch(url);
  const html = await res.text();

  // Regex para pegar todos os blocos de loja
  const regex =
    /<p class="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--units-text">([\s\S]*?)<\/p>/g;
  const matches = [...html.matchAll(regex)];

  const stores = matches.map((match) => {
    // Remove tags e quebra por <br>
    const lines = match[1].split("<br>").map((line) =>
      line.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
    );

    let name = "",
      cnpj = "",
      ie = "",
      endereco = "",
      bairro = "",
      cidade = "",
      cep = "";
    if (lines[0]) name = lines[0];
    if (lines[1]) {
      const cnpjMatch = lines[1].match(/CNPJ:\s*([\d./-]+)/);
      if (cnpjMatch) cnpj = cnpjMatch[1];
      const ieMatch = lines[1].match(/I\.E:?\s*([\d]+)/);
      if (ieMatch) ie = ieMatch[1];
    }
    if (lines[2]) {
      const enderecoMatch = lines[2].match(/Endere[cç]o: ([^B]+)/i);
      if (enderecoMatch) endereco = enderecoMatch[1].trim();
      const bairroMatch = lines[2].match(/Bairro: ([^C]+)/i);
      if (bairroMatch) bairro = bairroMatch[1].trim();
    }
    if (lines[3]) {
      const cidadeMatch = lines[3].match(/Cidade: ([^ -]+)/i);
      if (cidadeMatch) cidade = cidadeMatch[1].trim();
      const cepMatch = lines[3].match(/CEP: ([\d.-]+)/i);
      if (cepMatch) cep = cepMatch[1];
      if (!cidade || !cep) {
        const cidadeCepMatch = lines[3].match(
          /([^ -]+\/[A-Z]{2}) - CEP: ([\d.-]+)/i,
        );
        if (cidadeCepMatch) {
          cidade = cidadeCepMatch[1];
          cep = cidadeCepMatch[2];
        }
      }
    }
    if (!bairro && lines[3]) {
      const bairroMatch = lines[3].match(/Bairro: ([^ -]+)/i);
      if (bairroMatch) bairro = bairroMatch[1].trim();
    }
    if (!cidade && lines[3]) {
      const cidadeMatch = lines[3].match(/Cidade: ([^ -]+)/i);
      if (cidadeMatch) cidade = cidadeMatch[1].trim();
    }
    if (!cep && lines[4]) {
      const cepMatch = lines[4].match(/CEP: ([\d.-]+)/i);
      if (cepMatch) cep = cepMatch[1];
    }
    return { name, cnpj, ie, endereco, bairro, cidade, cep };
  });

  return { stores };
}
