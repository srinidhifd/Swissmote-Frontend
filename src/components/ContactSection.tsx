// src/components/ContactSection.tsx

export function ContactSection() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-400 mb-12">
          Have questions or want to reach out? Fill in the form below, and we'll get back to you as soon as possible.
        </p>

        <form className="grid grid-cols-1 gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Input */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 bg-secondary text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 bg-secondary text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Message Input */}
          <textarea
            placeholder="Your Message"
            rows={6}
            className="w-full p-4 bg-secondary text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-10 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
