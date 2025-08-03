import { div } from "framer-motion/client"

export default function ProfileDetailSection() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">自己紹介</h1>
      <div className="prose max-w-none prose-lg">
        <p className="text-gray-700 leading-relaxed mb-6">
            こんにちは、kyo1941です。
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
            ここに詳細な自己紹介を記載します。
        </p>
      </div>
    </div>
  );
}
