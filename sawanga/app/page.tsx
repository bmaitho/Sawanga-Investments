import Hero from "@/components/home/Hero";
import CoreProducts from "@/components/home/CoreProducts";
import WhyPartner from "@/components/home/WhyPartner";
import {
  SolutionsTeaser,
  PartnerBrands,
  PainterTeaser,
  FinalCTA,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoreProducts />
      <WhyPartner />
      <SolutionsTeaser />
      <PartnerBrands />
      <PainterTeaser />
      <FinalCTA />
    </>
  );
}
