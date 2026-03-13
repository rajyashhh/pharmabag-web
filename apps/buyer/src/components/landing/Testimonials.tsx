'use client';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "This is your Testimonial section paragraph. It's a great place to tell users. This is your Testimonial section paragraph. It's a great place to tell users",
    name: 'Smith',
    role: 'Medicine Retailer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Smith',
  },
  {
    id: 2,
    quote:
      "This is your Testimonial section paragraph. It's a great place to tell users. This is your Testimonial section paragraph. It's a great place to tell users",
    name: 'Drew Carlyle',
    role: 'Shop Owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew',
  },
  {
    id: 3,
    quote:
      "This is your Testimonial section paragraph. It's a great place to tell users. This is your Testimonial section paragraph. It's a great place to tell users",
    name: 'Jane Doe',
    role: 'Pharmacy Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
];

export default function Testimonials() {
  return (
    <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg rounded-2xl p-8 hover:scale-105 hover:bg-white/40 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full shadow-md border-2 border-white/60"
                />
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base text-gray-700 text-center mb-6 leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Name & Role */}
              <div className="text-center border-t border-white/30 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
