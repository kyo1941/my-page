import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { OgpData } from "@/app/types/ogp";
import { remarkLinkPreview } from "@/app/utils/remarkLinkPreview";
import { LinkPreviewCard } from "@/app/components/LinkPreviewCard";

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
