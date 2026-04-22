export type MarkdownSegment = { type: "markdown"; content: string };
export type ToggleSegment = {
  type: "toggle";
  title: string;
  children: ToggleNode[];
};
export type ToggleNode = MarkdownSegment | ToggleSegment;

function detectBodyIndent(lines: string[], startIndex: number): number {
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i] !== "") {
      const indentMatch = lines[i].match(/^(\s*)/);
      return indentMatch ? indentMatch[1].length : 0;
    }
  }
  return -1;
}

function parseLines(lines: string[], baseIndent: number): ToggleNode[] {
  const segments: ToggleNode[] = [];
  let i = 0;
  let markdownLines: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)> (.*)/);

    if (match && match[1].length === baseIndent) {
      if (markdownLines.length > 0) {
        segments.push({ type: "markdown", content: markdownLines.join("\n") });
        markdownLines = [];
      }

      const title = match[2];
      i++;

      const bodyIndent = detectBodyIndent(lines, i);
      const bodyLines: string[] = [];

      if (bodyIndent > baseIndent) {
        while (i < lines.length) {
          const bodyLine = lines[i];
          if (bodyLine === "" || bodyLine.startsWith(" ".repeat(bodyIndent))) {
            bodyLines.push(bodyLine === "" ? "" : bodyLine.slice(bodyIndent));
            i++;
          } else {
            break;
          }
        }
      }

      segments.push({
        type: "toggle",
        title,
        children: parseLines(bodyLines, 0),
      });
    } else {
      markdownLines.push(line);
      i++;
    }
  }

  if (markdownLines.length > 0) {
    segments.push({ type: "markdown", content: markdownLines.join("\n") });
  }

  return segments;
}

export function parseToggleSegments(markdown: string): ToggleNode[] {
  return parseLines(markdown.split("\n"), 0);
}
