import { useCareerSection } from "@/app/hooks/profile/useCareerSection";
import CareerItem from "@/app/ui/profile/section/CareerItem";

export default function CareerSection() {
  const { processedCareerData } = useCareerSection();

  return (
    <div>
      <h2 className="text-on-sky-subtle text-3xl font-bold mb-10 text-gray-900">
        経歴
      </h2>
      <div className="mt-6 mx-6 space-y-10 relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b from-gray-600 to-gray-100"
          aria-hidden="true"
        />
        {processedCareerData.map((career, index) => (
          <CareerItem key={index} {...career} />
        ))}
      </div>
    </div>
  );
}
