import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { SiZenn } from "react-icons/si";
import { ROUTES, EXTERNAL_LINKS } from "@/app/routes";

export default function ProfileTeaser() {
  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <Image
          className="rounded-full object-cover flex-shrink-0 border-2 border-gray-300"
          src="/profile.jpg"
          alt="プロフィール画像"
          width={160}
          height={160}
          priority
        />
        <div className="flex-1 text-left">
          <p className="text-on-sky py-4 text-gray-900">
            こんにちは、kyo1941です。
            <br />
            Androidエンジニアをやっています。音楽を聴いたり、麻婆豆腐を作ったりしています。
            <br />
          </p>
          <div>
            <Link
              href={ROUTES.PROFILE}
              className="text-sm text-link-color hover:text-link-color-hover hover:underline"
            >
              詳しくはこちら
            </Link>
          </div>
          <div className="pt-6 flex items-center gap-5">
            <Link
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-block hover:opacity-70 transition-opacity"
            >
              <FaGithub aria-hidden className="h-8 w-8 text-gray-900" />
            </Link>

            <Link
              href={EXTERNAL_LINKS.ZENN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zenn"
              className="inline-block hover:opacity-70 transition-opacity"
            >
              {/* Zennの絵は箱いっぱいに描かれているため、同じ寸法だとGitHubより大きく見える */}
              <SiZenn aria-hidden className="h-7 w-7 text-gray-900" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
