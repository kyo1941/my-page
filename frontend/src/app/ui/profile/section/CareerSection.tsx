import { useCareerSection } from "@/app/hooks/profile/useCareerSection";
import CareerItem from "@/app/ui/profile/section/CareerItem";

export default function CareerSection() {
  const { processedCareerData } = useCareerSection();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">経歴</h2>
      <div className="m-6 relative border-l-2 border-gray-300">
        {processedCareerData.map((career, index) => (
          <CareerItem key={index} {...career} />
        ))}
      </div>
    </div>
  );
}
