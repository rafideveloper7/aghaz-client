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
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isHidden = sessionStorage.getItem('announcement-popup-hidden');
    if (isHidden) {
      setDismissed(true);
      setLoading(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    fetchAnnouncement().then(data => {
      setAnnouncement(data);
      setLoading(false);

      if (!data) {
        return;
      }

      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 55000);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem('announcement-popup-hidden', 'true');
  };

  if (dismissed || loading || !announcement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed bottom-24 right-4 z-[70] w-[calc(100vw-2rem)] max-w-sm sm:bottom-6 sm:right-6"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-black/10 p-4 shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: announcement.bgColor }}
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 rounded-full p-1.5 transition-all hover:bg-white/20"
              style={{ color: announcement.textColor }}
              aria-label="Hide announcement"
            >
              <FiX className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80"
                style={{ color: announcement.textColor }}
              >
                Announcement
              </p>

              {announcement.link ? (
                <a
                  href={announcement.link}
                  className="mt-2 inline-flex items-start gap-2 text-sm font-medium leading-6 hover:underline"
                  style={{ color: announcement.textColor }}
                >
                  <span>{announcement.text}</span>
                  <FiArrowRight className="mt-1 h-4 w-4 flex-shrink-0" />
                </a>
              ) : (
                <p
                  className="mt-2 text-sm font-medium leading-6"
                  style={{ color: announcement.textColor }}
                >
                  {announcement.text}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
