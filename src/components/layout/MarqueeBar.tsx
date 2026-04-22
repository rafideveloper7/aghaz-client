'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiZap } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from '@/lib/constants';

// Loads announcement from API - no hardcoded data
const fetchAnnouncement = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/announcement`);
    if (data.success && data.data && data.data.isActive) {
      return data.data;
    }
  } catch {
    // Silently fail - no marquee if API unavailable
  }
  return null;
};

export function MarqueeBar() {
  const [announcement, setAnnouncement] = useState<{ text: string; bgColor: string; textColor: string; link?: string } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isHidden = sessionStorage.getItem('marquee-hidden');
    if (isHidden) {
      setHidden(true);
      setLoading(false);
      return;
    }

    fetchAnnouncement().then(data => {
      setAnnouncement(data);
      setLoading(false);
    });
  }, []);

  const handleClose = () => {
    setHidden(true);
    sessionStorage.setItem('marquee-hidden', 'true');
  };

  if (hidden || loading || !announcement) return null;

  const text = announcement.text;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className=" relative  border-b border-black/10 z-[55]"
      style={{ backgroundColor: announcement.bgColor }}
    >
      <div className="flex items-center py-2.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 mx-8 text-xs sm:text-sm font-medium"
              style={{ color: announcement.textColor }}
            >
              <FiZap className="h-4 w-4 flex-shrink-0 opacity-70" />
              {text}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-all"
        style={{ color: announcement.textColor }}
        aria-label="Hide bar"
      >
        <FiX className="h-3.5 w-3.5" />
      </button>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
