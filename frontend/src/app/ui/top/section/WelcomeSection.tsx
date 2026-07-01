import Greeting from "./Greeting";
import ProfileTeaser from "./ProfileTeaser";
import ChevronIcon from "@/app/components/ChevronIcon";

export default function WelcomeSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-6rem)] flex-col justify-center gap-10 sm:gap-14">
      <Greeting />
      <ProfileTeaser />

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <ChevronIcon className="h-6 w-6 text-sky-700/50 motion-safe:animate-bounce" />
      </div>
    </section>
  );
}
