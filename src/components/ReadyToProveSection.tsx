// src/components/ReadyToProveSection.tsx

export function ReadyToProveSection() {
    return (
      <section className="flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-gray-800 py-40">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-4">
            Ready to Prove Your Skills?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Start your first assignment now and join Swissmote’s unique hiring experience.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-gray-100 to-gray-300 text-black font-semibold rounded-full shadow-lg hover:from-gray-200 hover:to-gray-400 transition-transform transform hover:scale-110 hover:shadow-xl">
            Get Started
          </button>
        </div>
      </section>
    );
  }
  