"use client";

import { useProfileDetail } from "@/app/hooks/profile/useProfileDetail";

export default function ProfileDetailSection() {
  const { profile } = useProfileDetail();

  return (
    <div>
      <div className="text-on-sky prose max-w-none prose-lg">
        <ul className="text-gray-800 leading-relaxed mb-6">
          <li className="my-1">{profile.birthplace}</li>
          <li className="my-1">
            {profile.birthday} 生まれ（{profile.age}歳）
          </li>
          <li className="my-1">{profile.university}</li>
        </ul>
        {profile.description.map((desc, i) => (
          <p
            key={i}
            className={
              i === profile.description.length - 1 ? "mt-6" : undefined
            }
          >
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
}
