import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa"; // Import user icon

export function TestimonialsSection() {
  const testimonials = [
    { quote: "This hiring process is truly unique and efficient.", author: "Jane Doe" },
    { quote: "Loved the real-world project assignment approach!", author: "John Smith" },
    { quote: "Quick, transparent, and skill-focused hiring. Highly recommend.", author: "Emily Johnson" },
  ];

  return (
    <section className="py-20 max-w-5xl mx-auto text-center px-4">
      <h2 className="text-4xl font-bold text-white mb-16">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="p-10 bg-gray-700/20 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 hover:border-white/30 transition transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <FaUserCircle className="text-5xl mx-auto mb-4 text-gray-300" /> {/* User icon */}
            <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
            <p className="font-semibold text-gray-300">- {testimonial.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
