import { getSortedPostsData } from '@/app/repository/blogRepository';

export function useBlogList() {
  const blogs = getSortedPostsData();
  return { blogs };
}
