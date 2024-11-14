"use client";

import { SparklesCore } from "../../@/components/ui/sparkles";

export function SparklesPreview() {
  return (
    <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Hero Text */}
      <div className="relative z-20 text-center max-w-4xl px-6 md:px-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-4 md:mb-6">
          Welcome to Swissmote
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-300 mt-2 md:mt-4 mb-4 md:mb-6">
          Connecting Talent with Opportunity
        </p>
        <p className="text-md md:text-lg lg:text-xl font-light text-gray-400 max-w-lg mx-auto mb-6 md:mb-8 lg:mb-10">
          Join our ecosystem where job seekers and recruiters meet in a seamless and efficient platform.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex space-x-6 mt-6 md:mt-8 lg:mt-10 justify-center">
          <button className="px-8 py-3 md:px-10 md:py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
            Get Started
          </button>
          <button className="px-8 py-3 md:px-10 md:py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
