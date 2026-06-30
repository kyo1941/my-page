import { useCareerSection } from "@/app/hooks/profile/useCareerSection";
import CareerItem from "@/app/ui/profile/section/CareerItem";

export default function CareerSection() {
  const { processedCareerData } = useCareerSection();

  return (
    <div>
      <h2 className="text-on-sky-subtle text-3xl font-bold mb-10 text-gray-900">
        経歴
      </h2>
      <div className="mt-6 mx-6 space-y-10 relative border-l-2 border-gray-200">
        {processedCareerData.map((career, index) => (
          <CareerItem key={index} {...career} />
        ))}
      </div>
    </div>
  );
}
