// src/pages/LandingPage.tsx
import React from "react";
import { SparklesPreview } from "../components/SparklesPreview";
import { KeyFeaturesDemo } from "../components/KeyFeaturesDemo";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <SparklesPreview />

      {/* Key Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-black text-white">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#D4AF37]">
          Why Choose Swissmote?
        </h2>
        <KeyFeaturesDemo />
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black text-gray-400 text-center border-t border-gray-800">
        <p className="text-sm md:text-base">© 2024 Swissmote. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6 text-xs md:text-sm">
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
