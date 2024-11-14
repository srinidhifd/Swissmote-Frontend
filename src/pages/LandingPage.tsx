import React from "react";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import { InfiniteMovingCardsDemo } from "../components/InfiniteMovingCardsDemo";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section */}
      <GridBackgroundDemo />

      {/* Main Content */}
      <div className="text-center p-8 max-w-screen-xl mx-auto">

        {/* Features Section */}
        <section className="py-20">
          <h2 className="text-4xl font-bold mb-12 text-[#D4AF37]">Why Choose Swissmote?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Efficient Job Listings", description: "Post and manage job listings seamlessly." },
              { title: "Automated Assignments", description: "Save time with automated notifications and task assignments." },
              { title: "Interactive Dashboard", description: "Track and manage applications efficiently." },
            ].map((feature, index) => (
              <div key={index} className="p-8 bg-[#1A1A1A] rounded-lg shadow-lg hover:bg-[#292929] transition">
                <h3 className="text-xl font-semibold mb-2 text-[#D4AF37]">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-[#0D0D0D] rounded-lg shadow-lg mb-12">
          <h2 className="text-4xl font-bold mb-12 text-[#D4AF37]">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Step 1: Create Your Profile", description: "Build a profile that showcases your skills or job requirements." },
              { title: "Step 2: Post Jobs or Browse Opportunities", description: "Companies post listings, professionals browse and apply." },
              { title: "Step 3: Connect & Collaborate", description: "Find the perfect match and start collaborating seamlessly." },
            ].map((step, index) => (
              <div key={index} className="p-6 bg-[#1A1A1A] rounded-lg shadow-lg hover:bg-[#292929] transition">
                <h3 className="text-2xl font-semibold mb-4 text-[#D4AF37]">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 text-center">
          <InfiniteMovingCardsDemo />
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-[#8B0000] to-[#D4AF37] text-center text-white rounded-lg shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join the Swissmote community and unlock your potential.</p>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
            Sign Up Today
          </button>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-black text-gray-400 text-center">
          <p>© 2024 Swissmote. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-6">
            <a href="#about" className="hover:text-white">About Us</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
