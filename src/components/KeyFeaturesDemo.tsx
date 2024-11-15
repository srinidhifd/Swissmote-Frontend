import { FaRegListAlt, FaUserTie, FaTasks, FaRegClock, FaEnvelopeOpenText, FaExpandArrowsAlt } from "react-icons/fa";

export function KeyFeaturesDemo() {
  const features = [
    { icon: FaRegListAlt, title: "Job Listings", description: "Easily create, manage, and update job listings for your organization." },
    { icon: FaUserTie, title: "Candidate Management", description: "Track and manage applications with automated message responses." },
    { icon: FaTasks, title: "Automated Assignments", description: "Assign tasks and manage roles efficiently with automated workflows." },
    { icon: FaRegClock, title: "Real-Time Updates", description: "Stay updated on job applications and interactions with daily updates." },
    { icon: FaEnvelopeOpenText, title: "Message Automation", description: "Automate message delivery and responses for streamlined communication." },
    { icon: FaExpandArrowsAlt, title: "Future Scalability", description: "Designed with scalability in mind for future SaaS product extensions." },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <h2 className="text-4xl font-bold text-center mb-12 md:mb-16 lg:mb-20">Why Choose Swissmote?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 md:p-8 lg:p-10 bg-black/30 backdrop-blur-md text-white rounded-2xl shadow-lg border border-white/10 hover:border-white/30 transition transform hover:scale-105"
          >
            <feature.icon className="text-3xl md:text-4xl mb-3 md:mb-4 text-gray-300" />
            <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
            <p className="text-gray-400 text-sm md:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
