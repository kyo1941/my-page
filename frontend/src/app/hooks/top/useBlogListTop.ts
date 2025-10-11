import { getSortedPostsData } from '@/app/repository/blogRepository';

export function useBlogListTop(limit: number = 3) {
  // Repositoryから取得し、必要ならslice等で整形
  const blogs = getSortedPostsData().slice(0, limit);
  return { blogs };
}
