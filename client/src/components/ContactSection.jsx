import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ContactSection = () => {
  const { portfolio } = usePortfolio();
  const profile = portfolio?.profile;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setStatus(null);

    try {
      await emailjs.send(
        'service_gy467qp',
        'template_3xol97s',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Contact',
          message: formData.message,
        },
        {
          publicKey: 'KzB0Kzs8JEwnv6Ljt',
        }
      );

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('EmailJS Error:', error);

      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-slate-900/60 border-t border-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Let's Collaborate & Connect
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Have a project in mind, consulting inquiry, or job opportunity?
            Send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">

          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6">

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">

              <h3 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
                Contact Information
              </h3>

              {profile?.email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Email
                    </h4>

                    <a
                      href={`mailto:${profile.email}`}
                      className="text-slate-200 text-sm font-semibold hover:text-cyan-400 transition-colors break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Phone / WhatsApp
                    </h4>

                    <p className="text-slate-200 text-sm font-semibold">
                      {profile.phone}
                    </p>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Location
                    </h4>

                    <p className="text-slate-200 text-sm font-semibold">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}

            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-ping mr-2" />

              <span className="text-slate-200 font-bold text-sm">
                Response Guarantee
              </span>

              <p className="text-slate-400 text-xs">
                I typically respond to serious inquiries within 24 hours.
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">

            <form
              onSubmit={handleSubmit}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Job Opportunity / Project Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Message *
                </label>

                <textarea
                  name="message"
                  required
                  rows="6"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Status */}
              {status && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    status.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}

                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;