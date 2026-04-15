'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from '@/lib/constants';

const fetchAnnouncement = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/announcement`);
    if (data.success && data.data && data.data.isActive) {
      return data.data;
    }
  } catch {
    // Silently fail
  }
  return null;
};

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<{ text: string; bgColor: string; textColor: string; link?: string } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user dismissed in this session
    const isHidden = sessionStorage.getItem('announcement-hidden');
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
    sessionStorage.setItem('announcement-hidden', 'true');
  };

  if (hidden || loading || !announcement) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative w-full overflow-hidden z-[60]"
      style={{ backgroundColor: announcement.bgColor }}
    >
      <div className="flex items-center justify-center py-2.5 px-4 pr-12 max-w-screen-2xl mx-auto">
        {announcement.link ? (
          <a 
            href={announcement.link} 
            className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline" 
            style={{ color: announcement.textColor }}
          >
            {announcement.text}
            <FiArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
          </a>
        ) : (
          <span className="text-xs sm:text-sm font-medium text-center" style={{ color: announcement.textColor }}>
            {announcement.text}
          </span>
        )}
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-all"
        style={{ color: announcement.textColor }}
        aria-label="Hide announcement"
      >
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
