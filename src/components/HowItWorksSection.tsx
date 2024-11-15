import { FaPlayCircle, FaTasks, FaTrophy } from "react-icons/fa";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <FaPlayCircle className="text-5xl text-white mb-6" />,
      title: "Step 1",
      description: "Watch the video for your assignment.",
    },
    {
      icon: <FaTasks className="text-5xl text-white mb-6" />,
      title: "Step 2",
      description: "Complete the project according to guidelines.",
    },
    {
      icon: <FaTrophy className="text-5xl text-white mb-6" />,
      title: "Step 3",
      description: "Submit for evaluation. Fastest finisher wins.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <h2 className="text-4xl font-bold text-center mb-12 md:mb-16">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 md:p-8 bg-black/30 backdrop-blur-md text-white rounded-2xl shadow-lg border border-white/10 hover:border-white/30 transition transform hover:scale-105"
          >
            {step.icon}
            <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-300">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
