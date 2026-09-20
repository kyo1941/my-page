import { FiChevronDown } from "react-icons/fi";
import Greeting from "./Greeting";
import ProfileTeaser from "./ProfileTeaser";

export default function WelcomeSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-6rem)] flex-col justify-center gap-10 sm:gap-14">
      <Greeting />
      <ProfileTeaser />

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <FiChevronDown
          aria-hidden
          className="h-6 w-6 text-accent/50 motion-safe:animate-bounce"
        />
      </div>
    </section>
  );
}
