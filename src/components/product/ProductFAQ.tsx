'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { PRODUCT_FAQS } from '@/lib/constants';
import type { Product } from '@/types';

interface ProductFAQProps {
  faqs?: { question: string; answer: string }[];
}

export function ProductFAQ({ faqs }: ProductFAQProps) {
  const items = faqs && faqs.length > 0 ? faqs : PRODUCT_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
      <h3 className="mb-4 text-lg font-bold text-text-primary">
        Frequently Asked Questions
      </h3>
      <div className="divide-y divide-gray-100">
        {items.map((faq: { question: string; answer: string }, index: number) => (
          <div key={index} className="py-3 first:pt-0 last:pb-0">
            <button
              onClick={() => toggleIndex(index)}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={openIndex === index}
            >
              <span className="text-sm font-semibold text-text-primary md:text-base">
                {faq.question}
              </span>
              <FiChevronDown
                size={18}
                className={cn(
                  'shrink-0 text-text-secondary transition-transform duration-200',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm leading-relaxed text-text-secondary">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
