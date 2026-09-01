import HeroSection from "../../components/home/HeroSection";
import ServiceSection from "../../components/home/ServiceCard";
import StatsSection from "../../components/home/StatsSection";
import MechanicSection from "../../components/home/MechanicSection";

function Home() {
  return (
    <main>
      <HeroSection />
      <ServiceSection />
      <StatsSection />
      <MechanicSection />
    </main>
  );
}

export default Home;