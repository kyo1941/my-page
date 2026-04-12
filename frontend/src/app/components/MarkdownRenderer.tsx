import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { OgpData } from "@/app/types/ogp";
import { remarkLinkPreview } from "@/app/utils/remarkLinkPreview";
import { LinkPreviewCard } from "@/app/components/LinkPreviewCard";
import { CodeBlock } from "@/app/components/CodeBlock";

type Props = {
  content: string;
  ogpData?: Record<string, OgpData>;
};

export function MarkdownRenderer({ content, ogpData = {} }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkLinkPreview]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        pre({ children }) {
          const codeElement = React.Children.toArray(children).find(
            (child) =>
              React.isValidElement(child) &&
              (child as React.ReactElement).type === "code",
          ) as React.ReactElement<{ className?: string }> | undefined;
          const language =
            codeElement?.props.className?.match(/language-(\S+)/)?.[1];
          return <CodeBlock language={language}>{children}</CodeBlock>;
        },
        p({ children, ...props }) {
          const previewUrl = (props as Record<string, unknown>)[
            "data-link-preview"
          ] as string | undefined;

          if (previewUrl) {
            const data = ogpData[previewUrl];
            if (data) {
              return <LinkPreviewCard data={data} />;
            }
          }

          return <p {...props}>{children}</p>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
