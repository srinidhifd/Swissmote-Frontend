import { InfiniteMovingCards } from "../../@/components/ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  const testimonials = [
    {
      quote: "Swissmote streamlined our hiring process tremendously!",
      name: "Jane Doe",
      title: "HR Manager",
    },
    {
      quote: "An intuitive platform with top-notch candidates.",
      name: "John Smith",
      title: "Project Manager",
    },
    {
      quote: "Finding talent has never been easier!",
      name: "Emily Johnson",
      title: "Recruiter",
    },
  ];

  return (
    <div className="h-[30rem] rounded-md flex flex-col antialiased bg-black text-white items-center justify-center relative overflow-hidden">
      <h2 className="text-4xl font-bold mb-12 text-[#D4AF37]">What Our Users Say</h2>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className="px-4 py-6 bg-gradient-to-r from-[#1A1A1A] to-[#292929] rounded-lg shadow-lg"
      />
    </div>
  );
}
