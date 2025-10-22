import ProfileShowcase from "@/components/sections/profile-showcase";
import ServicesSection from "@/components/sections/services";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <ProfileShowcase />
      <ServicesSection />
    </div>
  );
}
