import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Paragraph, Link, Text } from "mdast";

export const remarkLinkPreview: Plugin<[], Root> = () => (tree) => {
  visit(tree, "paragraph", (node: Paragraph) => {
    if (node.children.length !== 1) return;
    const child = node.children[0];
    if (child.type !== "link") return;

    const link = child as Link;
    if (link.children.length !== 1) return;
    const linkText = link.children[0] as Text;
    if (linkText.type !== "text") return;
    if (linkText.value !== link.url) return;

    node.data = node.data ?? {};
    node.data.hProperties = {
      ...(node.data.hProperties as Record<string, unknown> | undefined),
      "data-link-preview": link.url,
    };
  });
};
