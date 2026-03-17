export type Blog = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
};

export type AdminBlogListItem = Pick<
  Blog,
  "slug" | "title" | "date" | "description"
> & {
  tags: string[];
};

export type BlogUpsertInput = {
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
};
