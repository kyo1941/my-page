import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, EXTERNAL_LINKS } from '@/app/routes';

export default function ProfileSection() {
  return (
    <div> 
      <h3 className="text-3xl font-bold mb-12 text-gray-900">自己紹介</h3>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <Image 
          className="rounded-full object-cover flex-shrink-0 border-2 border-gray-300" 
          src="/profile.jpg" 
          alt="プロフィール画像" 
          width={160} 
          height={160} 
        />
        <div className="flex-1 text-left">
          <p className="py-4 text-gray-900">
            こんにちは、kyo1941です。<br />
            音楽を聴いたり、競技プログラミングをやったりしています。<br />
          </p>
          <div>
            <Link href={ROUTES.PROFILE} className="text-sm text-blue-600 hover:text-blue-700 hover:underline">詳しくはこちら</Link>
          </div>
          <div className="pt-6 flex items-center gap-5">
            <Link href={EXTERNAL_LINKS.X} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-70 transition-opacity">
              <Image 
                className="object-cover" 
                src="/x-icon.svg" 
                alt="x icon"
                width={32} 
                height={32} 
              />
            </Link>
            
            <Link href={EXTERNAL_LINKS.GITHUB} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-70 transition-opacity">
              <Image 
                className="object-cover"  
                src="/github-icon.svg" 
                alt="github icon"   
                width={32} 
                height={32} 
              />
            </Link>

            <Link href={EXTERNAL_LINKS.WANTEDLY} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-70 transition-opacity">
              <Image 
                className="object-cover"  
                src="/wantedly-icon.svg" 
                alt="wantedly icon"   
                width={32} 
                height={32} 
              />
            </Link>

            <Link href={EXTERNAL_LINKS.ZENN} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-70 transition-opacity">
              <Image 
                className="object-cover"
                src="/zenn-icon.svg"
                alt="zenn icon"
                width={32} 
                height={32} 
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}