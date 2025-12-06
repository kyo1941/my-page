"use client";

import Link from "next/link";
import Image from "next/image";
import { usePortfolioList } from "@/app/hooks/portfolio/usePortfolioList";
import { ROUTES } from "@/app/routes";

export default function PortfolioListSection() {
  const { portfolios } = usePortfolioList();

  return (
    <div className="flex flex-col gap-8">
      {portfolios.length === 0 ? (
        <div className="text-center text-gray-600">
          ポートフォリオがまだありません。
        </div>
      ) : (
        portfolios.map((portfolio) => (
          <Link href={`${ROUTES.PORTFOLIO}/${portfolio.slug}`} key={portfolio.slug} className="block group">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row items-stretch gap-0 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-0.5">
              {portfolio.coverImage && (
                <div className="relative md:w-1/3 w-full h-48 md:h-auto">
                  <Image 
                    src={portfolio.coverImage} 
                    alt={portfolio.title}
                    fill
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white"></div>
                </div>
              )}
              <div className={`${portfolio.coverImage ? "md:w-2/3" : "md:w-full"} w-full flex flex-col p-6`}>
                <h4 className="font-semibold mb-2 text-gray-900 text-xl group-hover:text-blue-600 transition-colors">{portfolio.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{portfolio.date}</p>
                <p className="text-base mb-4 text-gray-700 flex-grow">{portfolio.description}</p>
                <div className="flex items-center justify-end mt-auto">
                  <span className="text-blue-600 text-sm font-medium">詳細を見る</span>
                  <span className="text-blue-600 text-sm ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
