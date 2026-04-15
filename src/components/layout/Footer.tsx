'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaPinterest, FaLinkedinIn } from 'react-icons/fa';
import { getWhatsAppUrl } from '@/lib/utils';
import { API_URL, SITE_NAME } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import axios from 'axios';

const socialIcons: Record<string, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
};

interface SocialLink {
  _id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const { data: settings } = useSiteSettings();
  const [contact, setContact] = useState<ContactInfo>({
    email: 'support@aghaz.com',
    phone: '+92 300 1234567',
    address: 'Lahore, Pakistan',
    whatsapp: '923001234567',
  });

  useEffect(() => {
    // Fetch social links
    axios.get(`${API_URL}/api/footer-social`).then(res => {
      if (res.data.success) setSocialLinks(res.data.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!settings) return;
    setContact(prev => ({
      email: settings.contactEmail || prev.email,
      phone: settings.contactPhone || prev.phone,
      address: settings.contactAddress || prev.address,
      whatsapp: settings.whatsappNumber || prev.whatsapp,
    }));
  }, [settings]);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black text-white">{SITE_NAME}</h3>
            <p className="mt-3 text-sm text-gray-400">
              Discover smart living with curated products that make life easier and more enjoyable.
            </p>
            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {socialLinks.map(link => {
                  const Icon = socialIcons[link.platform] || FaFacebookF;
                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-primary hover:text-white"
                      aria-label={link.platform}
                      title={link.label || link.platform}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/shop" className="text-sm text-gray-400 transition-colors hover:text-white">Shop</Link></li>
              <li><Link href="/new-arrivals" className="text-sm text-gray-400 transition-colors hover:text-white">New Arrivals</Link></li>
              <li><Link href="/deals" className="text-sm text-gray-400 transition-colors hover:text-white">Flash Deals</Link></li>
              <li><Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/contact" className="text-sm text-gray-400 transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-400 transition-colors hover:text-white">Cart</Link></li>
              <li><span className="text-sm text-gray-400">Shipping Policy</span></li>
              <li><span className="text-sm text-gray-400">Return Policy</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiPhone className="mt-0.5 shrink-0" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMail className="mt-0.5 shrink-0" />
                <span>{contact.email}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="mt-0.5 shrink-0" />
                <span>{contact.address}</span>
              </li>
            </ul>
            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl(undefined, contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
