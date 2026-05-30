'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandsMegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function BrandsMegaMenu({ isOpen, onMouseEnter, onMouseLeave }: BrandsMegaMenuProps) {
  const brandGroups = [
    {
      title: 'Top Global Brands',
      titleColor: 'text-red-600',
      subgroups: [
        {
          name: 'Multinationals',
          links: ['ABBOTT LABORATORIES', 'PFIZER LTD.', 'SANOFI', 'MSD PHARMA', 'ALLERGAN', 'ALCON']
        },
        {
          name: 'Specialized Care',
          links: ['MODI MUNDI', 'HETERO HEALTHCARE', 'INSULIN']
        }
      ]
    },
    {
      title: 'Leading Indian Giants',
      titleColor: 'text-purple-700',
      subgroups: [
        {
          name: 'Market Leaders',
          links: ['SUN PHARMACEUTICALS', 'CIPLA INDIA LTD.', 'DR REDDY\'S', 'LUPIN LTD.', 'ALKEM']
        },
        {
          name: 'Growing Portfolios',
          links: ['MANKIND PHARMA', 'ZYDUS CADILA', 'INTAS LABS.', 'GLENMARK']
        }
      ]
    },
    {
      title: 'Trusted Manufacturers',
      titleColor: 'text-purple-700',
      subgroups: [
        {
          name: 'General Medicine',
          links: ['ALEMBIC', 'ARISTO PHARMA', 'MACLEODS', 'IPCA LABS', 'AJANTA PHARMA']
        },
        {
          name: 'Others',
          links: ['U.S.V. LIMITED', 'ZUVENTUS', 'EMCURE', 'EASTINDIA PHARMA']
        }
      ]
    }
  ];



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="fixed top-[88px] left-0 right-0 z-40 flex justify-center px-6"
        >
          <div className="w-[92vw] max-h-[calc(100vh-120px)] bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100/50 overflow-y-auto overflow-x-hidden backdrop-blur-3xl no-sb">
            <div className="flex p-12 gap-16 min-h-0">
              {/* Brand Columns */}
              <div className="flex-1 grid grid-cols-3 gap-12">
                {brandGroups.map((group, idx) => (
                  <div key={idx} className="space-y-10">
                    <div>
                      <h3 className={`text-[13px] font-bold uppercase tracking-[0.1em] mb-8 flex items-center gap-2 ${group.titleColor}`}>
                        {group.title}
                        {idx === 0 && <span className="text-lg font-light">›</span>}
                      </h3>
                      <div className="space-y-10">
                        {group.subgroups.map((sub, sIdx) => (
                          <div key={sIdx}>
                            <h4 className="text-[15px] font-bold text-[#800080] mb-4 flex items-center justify-between group cursor-pointer hover:text-sky-600 transition-colors">
                              {sub.name}
                              <span className="text-gray-400 group-hover:text-sky-600 transition-colors">›</span>
                            </h4>
                            <ul className="space-y-2.5">
                              {sub.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <a href="#" className="text-[14px] text-gray-500 hover:text-sky-600 transition-colors duration-200">
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
