export type Blog = {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string | undefined;
  tags?: string[];
  content: string;
};

export type AdminBlogListItem = Pick<Blog, "slug" | "title" | "date" | "description"> & {
  tags: string[];
};

export type BlogUpsertInput = {
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  coverImage?: string;
};
