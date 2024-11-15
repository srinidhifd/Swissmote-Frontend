import { SparklesPreview } from "../components/SparklesPreview";
import { KeyFeaturesDemo } from "../components/KeyFeaturesDemo";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ReadyToProveSection } from "../components/ReadyToProveSection";
import  NavBar  from "../components/Navbar";
import {Footer} from "../components/Footer";
import Divider from "../components/Divider";
import { ContactSection } from "../components/ContactSection";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <SparklesPreview />
      <Divider />
      <HowItWorksSection />
      <Divider />

      <section id="features" className="py-24">
        <KeyFeaturesDemo />
      </section>
      <Divider />

      <TestimonialsSection />

      <ReadyToProveSection />
      <ContactSection />
      <Divider />  
      <Footer />
    </div>
  );
};

export default LandingPage;
