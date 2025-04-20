import Navbar from "@/app/components/Layout/Navbar";
import Hero from "@/app/components/Home/Hero";
import FeaturedSection from "@/app/components/Home/FeaturedSection";
import EducationalOfferings from "@/app/components/Home/EducationalOfferings";
import ActivitiesGrid from "@/app/components/Activities/ActivitiesGrid";
import PointsDisplay from "@/app/components/Gamification/PointsDisplay";
import Footer from "@/app/components/Layout/Footer";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow ga">
          <Hero />
          <FeaturedSection />
          <EducationalOfferings />
          <ActivitiesGrid />
          <PointsDisplay />
        </main>
        <Footer />
      </div>
    // </div>
  );
}
