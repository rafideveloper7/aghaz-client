'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getWhatsAppUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FiCheck, FiShoppingBag, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function OrderSuccessPage() {
  const orderNumber = `AGH-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: 'easeInOut' }}
          >
            <FiCheck size={48} className="text-primary" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-black text-text-primary md:text-4xl"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-base text-text-secondary"
        >
          Thank you for your order! We will contact you shortly to confirm your order details.
        </motion.p>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 rounded-xl border border-primary/20 bg-primary-50 p-4"
        >
          <p className="text-sm text-primary-600">Order Number</p>
          <p className="mt-1 text-xl font-bold text-primary-800">{orderNumber}</p>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-left"
        >
          <h3 className="mb-4 text-lg font-bold text-text-primary">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Order Confirmation</p>
                <p className="text-xs text-text-secondary">
                  Our team will call you within 24 hours to confirm your order.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Dispatch</p>
                <p className="text-xs text-text-secondary">
                  Your order will be dispatched within 1-2 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Delivery</p>
                <p className="text-xs text-text-secondary">
                  Expect delivery within 2-5 business days. Pay cash upon delivery.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="/shop">
            <Button variant="primary" size="lg" fullWidth asMotion>
              <FiShoppingBag size={18} />
              Continue Shopping
            </Button>
          </Link>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              asMotion
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <FaWhatsapp size={18} />
              Need Help? WhatsApp
            </Button>
          </a>
        </motion.div>

        {/* Support Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-xs text-text-secondary"
        >
          Need help with your order? Contact us on WhatsApp or call us at +92 300 1234567
        </motion.p>
      </motion.div>
    </div>
  );
}
