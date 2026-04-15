'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCreateContactMessage } from '@/hooks/useContactMessages';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getWhatsAppUrl } from '@/lib/utils';

export default function ContactPage() {
  const { data: settings } = useSiteSettings();
  const createContactMessage = useCreateContactMessage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await createContactMessage.mutateAsync(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {}
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">Contact Us</h1>
            <p className="mt-4 text-lg text-white/70">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                <p className="mt-2 text-gray-600">Have a question or need help? Reach out to us.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-sm text-gray-600 mt-0.5">{settings?.contactAddress || 'Lahore, Pakistan'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600 mt-0.5">{settings?.contactPhone || '+92 300 1234567'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-0.5">{settings?.contactEmail || 'support@aghaz.com'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Working Hours</p>
                    <p className="text-sm text-gray-600 mt-0.5">{settings?.workingHours || 'Mon - Sat: 9AM - 9PM'}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href={getWhatsAppUrl('Hi! I want to contact Aghaz.', settings?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600 transition-colors"
              >
                <FiMessageSquare className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={5}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createContactMessage.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {createContactMessage.isPending ? (
                      <>
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
