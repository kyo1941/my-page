import "server-only";
import { portfolioRepository } from "@/app/repository/portfolioRepository";

export async function fetchPortfolioList() {
  return portfolioRepository.getSortedPostsData();
}

export async function fetchPortfolioPost(slug: string) {
  return portfolioRepository.getPostData(slug);
}

export async function fetchPortfolioSlugs() {
  return portfolioRepository.getAllPostSlugs();
}
