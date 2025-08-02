import Link from 'next/link'
import Image from 'next/image';

export default function ProfileSection() {
  return (
    <section className="border-b border-border pb-[5%] pt-[5%]"> 
      <h3 className="text-2xl font-bold mb-6">自己紹介</h3>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <Image 
          className="rounded-full object-cover flex-shrink-0 border-2 border-foreground" 
          src="/profile.jpg" 
          alt="プロフィール画像" 
          width={160} 
          height={160} 
        />
        <div className="flex-1 text-left">
          <p className="mb-10">
            こんにちは、kyo1941です。<br />
            音楽を聴いたり、競技プログラミングをやったりしています。<br />
          </p>
          <div>
            <Link href="#" className="text-sm text-link-color">詳しくはこちら</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
