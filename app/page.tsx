import Hero from "@/components/home/Hero";
import CoreProducts from "@/components/home/CoreProducts";
import WhyPartner from "@/components/home/WhyPartner";
import ProjectGallery from "@/components/home/ProjectGallery";
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
      <ProjectGallery />
      <SolutionsTeaser />
      <PartnerBrands />
      <div className="gold-divider" />
      <PainterTeaser />
      <FinalCTA />
    </>
  );
}
