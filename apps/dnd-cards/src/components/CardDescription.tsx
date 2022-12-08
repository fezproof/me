import { toHtml } from "hast-util-to-html";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { toHast } from "mdast-util-to-hast";
import { gfmTable } from "micromark-extension-gfm-table";
import { createMemo } from "solid-js";

interface CardDescription {
  description: string[] | null;
}

const CardDescription = ({ description }: CardDescription) => {
  const desc = createMemo(() => {
    const shortDescription = description?.slice(1);

    var energy =
      shortDescription?.reduce(function (p, d) {
        return p + d + (d.startsWith("|") ? "\n" : "\n\n");
      }, "") ?? "";

    const mdast = fromMarkdown(energy, {
      extensions: [gfmTable],
      mdastExtensions: [gfmTableFromMarkdown],
    });
    const hast = toHast(mdast);
    const html = toHtml(hast ?? [], {});

    return html;
  });

  return <div innerHTML={desc()} class="[&>p]:mb-2" />;
};

export default CardDescription;
