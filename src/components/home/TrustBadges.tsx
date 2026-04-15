'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiRefreshCw, FiShield, FiDollarSign } from 'react-icons/fi';

// Trust badges are static business policies - not loaded from DB
const badges = [
  { icon: FiDollarSign, title: 'Cash on Delivery', description: 'Pay when you receive' },
  { icon: FiTruck, title: 'Fast Delivery', description: '2-5 business days' },
  { icon: FiRefreshCw, title: 'Easy Returns', description: '7-day return policy' },
  { icon: FiShield, title: 'Quality Assured', description: 'Verified products' },
];

export function TrustBadges() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary md:h-12 md:w-12">
                <badge.icon size={20} />
              </div>
              <h3 className="text-xs font-bold text-text-primary md:text-sm">{badge.title}</h3>
              <p className="mt-0.5 text-[10px] text-text-secondary md:text-xs">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
