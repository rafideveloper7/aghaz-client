'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTruck, FiShield, FiHeadphones, FiRefreshCw, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaPinterest, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/lib/constants';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getWhatsAppUrl } from '@/lib/utils';

const values = [
  { icon: FiTruck, title: 'Fast Delivery', description: 'Quick nationwide shipping to your doorstep within 3-5 business days.' },
  { icon: FiShield, title: 'Quality Assured', description: 'Every product is tested and verified for quality before listing.' },
  { icon: FiHeadphones, title: '24/7 Support', description: 'Our team is always available to help you with any questions.' },
  { icon: FiRefreshCw, title: 'Easy Returns', description: '30-day hassle-free return policy for your peace of mind.' },
];

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
}

export default function AboutPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const { data: settings } = useSiteSettings();
  const [contact, setContact] = useState({ email: 'support@aghaz.com', phone: '+92 300 1234567', address: 'Lahore, Pakistan', whatsapp: '923001234567' });
  const aboutHero = settings?.aboutHero;
  
  const bgGradient = aboutHero?.bgGradient || 'from-gray-900 via-gray-800 to-emerald-900';
  const bgColor = aboutHero?.bgColor || '#111827';
  const title = aboutHero?.title || 'About Aghaz';
  const subtitle = aboutHero?.subtitle || 'Your trusted destination for premium smart gadgets and innovative products';

  useEffect(() => {
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
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden" style={{ background: bgColor }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">{title}</h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Our Story</span>
              <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
                Bringing Innovation to Every Home
              </h2>
              <p className="mt-6 text-base text-gray-600 leading-relaxed">
                Aghaz was founded with a simple mission: to make smart, innovative products accessible to everyone in Pakistan. We believe that technology should simplify life, not complicate it.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                From kitchen gadgets to smart home devices, we carefully curate our collection to ensure every product meets our quality standards and delivers real value to our customers.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                With cash-on-delivery available nationwide and a dedicated support team, shopping at Aghaz is always convenient and hassle-free.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-emerald-600">500+</p>
                <p className="text-sm text-gray-600 mt-1">Products</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-blue-600">10K+</p>
                <p className="text-sm text-gray-600 mt-1">Customers</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-purple-600">7</p>
                <p className="text-sm text-gray-600 mt-1">Categories</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-orange-600">24/7</p>
                <p className="text-sm text-gray-600 mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Why Choose Aghaz</h2>
            <p className="mt-2 text-gray-600">We go the extra mile for our customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social & Contact */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Social Links */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Follow Us</h2>
              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map(link => {
                    const Icon = socialIcons[link.platform] || FaFacebookF;
                    return (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                      >
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 capitalize">{link.platform}</p>
                          {link.label && <p className="text-xs text-gray-500">{link.label}</p>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">Follow us on social media for updates and deals.</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{contact.address}</p>
                  </div>
                </div>
              </div>
              <a
                href={getWhatsAppUrl(undefined, contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl font-black sm:text-3xl">Ready to Start Shopping?</h2>
            <p className="mt-2 text-emerald-100 max-w-lg mx-auto">
              Discover our curated collection of premium gadgets and smart products.
            </p>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
