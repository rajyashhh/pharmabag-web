'use client';

import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { label: 'Blogs', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Return Policy', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-sky-100 via-cyan-100 to-lime-100 border-t border-white/40">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Left Section - Logo & Company Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center font-bold text-white text-3xl shadow-lg">
              P
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Pharma Bag</h3>
              <p className="text-sm md:text-base text-gray-700 font-medium">
                India&apos;s Only <span className="font-semibold">Trusted</span>
              </p>
              <p className="text-sm md:text-base text-gray-700">B2B Pharma Platform</p>
            </div>
          </div>

          {/* Right Section - Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm md:text-base font-medium text-gray-800 hover:text-sky-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-white/30 mt-12 pt-8">
          <p className="text-center text-sm text-gray-600">
            © 2026 PharmaBag. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
