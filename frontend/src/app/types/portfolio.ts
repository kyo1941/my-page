export type Portfolio = {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string | undefined;
  content: string;
};

export type AdminPortfolioListItem = Pick<
  Portfolio,
  "slug" | "title" | "date" | "description"
>;

export type PortfolioUpsertInput = {
  title: string;
  date: string;
  description: string;
  content: string;
  coverImage?: string;
};
