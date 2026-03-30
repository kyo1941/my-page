import type { OgpData } from "@/app/types/ogp";

type Props = {
  data: OgpData;
};

export function LinkPreviewCard({ data }: Props) {
  const domain = (() => {
    try {
      return new URL(data.url).hostname;
    } catch {
      return data.url;
    }
  })();

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-4 flex overflow-hidden rounded-lg border border-gray-200 no-underline transition-colors hover:bg-gray-50"
    >
      {data.image && (
        <div className="hidden flex-shrink-0 sm:block sm:w-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt={data.title ?? ""}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1 p-4">
        {data.title && (
          <span className="line-clamp-2 text-sm font-semibold text-gray-900">
            {data.title}
          </span>
        )}
        {data.description && (
          <span className="line-clamp-2 text-xs text-gray-500">
            {data.description}
          </span>
        )}
        <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
          {data.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.favicon}
              alt=""
              width={14}
              height={14}
              className="rounded-sm"
            />
          )}
          <span className="truncate">{data.siteName ?? domain}</span>
        </div>
      </div>
    </a>
  );
}
