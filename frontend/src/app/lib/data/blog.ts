import "server-only";
import { blogRepository } from "@/app/repository/blogRepository";
import { tagRepository } from "@/app/repository/tagRepository";

export async function fetchBlogList() {
  return blogRepository.getSortedPostsData();
}

export async function fetchBlogListWithLimit(limit: number) {
  return blogRepository.getSortedPostsData({ limit });
}

export async function fetchBlogPost(slug: string) {
  return blogRepository.getPostData(slug);
}

export async function fetchBlogSlugs() {
  return blogRepository.getAllPostSlugs();
}

export async function fetchTagList() {
  return tagRepository.getAll();
}
