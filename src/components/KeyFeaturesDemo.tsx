// src/components/KeyFeaturesDemo.tsx

export function KeyFeaturesDemo() {
  const features = [
    { title: "Job Listings", description: "Easily create, manage, and update job listings for your organization." },
    { title: "Candidate Management", description: "Track and manage applications with automated message responses." },
    { title: "Automated Assignments", description: "Assign tasks and manage roles efficiently with automated workflows." },
    { title: "Real-Time Updates", description: "Stay updated on job applications and interactions with daily updates." },
    { title: "Message Automation", description: "Automate message delivery and responses for streamlined communication." },
    { title: "Future Scalability", description: "Designed with scalability in mind for future SaaS product extensions." },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-lg shadow-lg transition-transform transform hover:scale-105"
          style={{
            border: '1px solid #D4AF37',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
          }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-[#D4AF37]">{feature.title}</h3>
          <p className="text-gray-300 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
