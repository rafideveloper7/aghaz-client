'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { PRODUCT_BENEFITS } from '@/lib/constants';

const benefitIcons = [FiCheck, FiTruck, FiShield, FiHeadphones];

interface ProductBenefitsProps {
  benefits?: string[];
}

export function ProductBenefits({ benefits }: ProductBenefitsProps) {
  const items = benefits && benefits.length > 0 ? benefits : PRODUCT_BENEFITS;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
      <h3 className="mb-4 text-lg font-bold text-text-primary">Why You&apos;ll Love This</h3>
      <div className="space-y-3">
        {items.map((benefit: string, index: number) => {
          const Icon = benefitIcons[index % benefitIcons.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                <Icon size={14} />
              </div>
              <span className="text-sm text-text-secondary">{benefit}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Additional trust icons row */}
      <div className="mt-6 flex flex-wrap gap-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <FiTruck size={16} className="text-primary" />
          <span>Free delivery over Rs. 2000</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <FiRefreshCw size={16} className="text-primary" />
          <span>7-day easy returns</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <FiShield size={16} className="text-primary" />
          <span>Quality guaranteed</span>
        </div>
      </div>
    </div>
  );
}
