import { useMemo } from "react";
import { profileContent } from "@/app/data/profileContent";

export function useProfileDetail() {
  const age = useMemo(() => {
    const today = new Date();
    const birthDate = new Date(profileContent.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  const profile = {
    ...profileContent,
    age,
  };

  return { profile };
}
