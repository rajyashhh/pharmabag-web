'use client';

interface TrustItem {
  title: string;
  subtitle: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    title: 'Fastest Delivery',
    subtitle: '',
  },
  {
    title: 'Controlled Qality',
    subtitle: '',
  },
  {
    title: 'Only B2B rates',
    subtitle: '',
  },
  {
    title: '0 Torelence 2 Duplicacy',
    subtitle: '',
  },
];

export default function TrustSection() {
  return (
    <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 text-center">
          {TRUST_ITEMS.map((item, index) => (
            <div
              key={index}
              className="space-y-4 transform hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-4xl md:text-5xl font-semibold text-gray-900">
                {item.title}
              </h3>
              {item.subtitle && <p className="text-lg text-gray-700">{item.subtitle}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
