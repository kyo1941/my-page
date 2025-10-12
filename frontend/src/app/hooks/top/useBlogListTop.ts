import { getSortedPostsData } from '@/app/repository/blogRepository';

export function useBlogListTop(limit: number = 3) {
  const blogs = getSortedPostsData().slice(0, limit);
  return { blogs };
}
