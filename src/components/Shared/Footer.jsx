import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Github,
  ArrowRight,
} from 'lucide-react';
import { X as XIcon } from 'lucide-react';
import logo from '../../assets/Logo/Rootfarming.png'; // Keep existing logo for now
import { Link } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out', offset: 100 });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && agreed) {
      console.log('Subscribed:', email);
      setEmail('');
      setAgreed(false);
    }
  };

  const habitLinks = [
    { name: 'Join Community', path: '/community' },
    { name: 'My Progress', path: '/my-progress' },
    { name: 'Wellness Tracker', path: '/wellness-tracker' },
    { name: 'Motivation Feed', path: '#' },
    { name: 'Student Dashboard', path: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '#' },
    { name: 'Our Mission', path: '#' },
    { name: 'Join Our Team', path: '#' },
    { name: 'Press & Media', path: '#' },
    { name: 'Contact Us', path: '#' },
  ];

  const resourceLinks = [
    { name: 'Student Resources', path: '#' },
    { name: 'Wellness Guides', path: '#' },
    { name: 'Community Stories', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
  ];

  const socialLinks = [
    { icon: XIcon, path: '#', label: 'X (Twitter)' },
    { icon: Instagram, path: '#', label: 'Instagram' },
    { icon: Linkedin, path: '#', label: 'LinkedIn' },
    { icon: Github, path: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-white dark:bg-[#111827] text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-8">
        {/* Top Section */}
        <div
          className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start"
          data-aos="fade-up"
        >
          {/* Brand Info */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="Synapse Logo" className="h-10 w-10" />
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
                Synapse
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              Empowering students with wellness, collaboration, and growth — one
              habit at a time. Build consistency, track your progress, and
              connect with a community that supports your success.
            </p>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-3 flex-wrap">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  +880 1700-123456
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  support@synapse.com
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Join the Synapse Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
              Get tips, motivation, and wellness insights delivered weekly to
              help you build better habits and achieve your goals.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="space-y-4 w-full max-w-lg"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-green-600 border-gray-300 dark:border-gray-700 rounded focus:ring-green-600"
                  required
                />
                <span>
                  I agree to receive updates and habit tips from Synapse.
                </span>
              </label>
            </form>

            {/* Social Icons */}
            <div
              className="mt-8 text-center sm:text-left"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Connect With Us
              </h3>
              <div className="flex justify-center sm:justify-start gap-4 flex-wrap">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      to={social.path}
                      aria-label={social.label}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 p-3 rounded-full transition-all duration-300"
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-800"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          {[
            { title: 'Habits', links: habitLinks },
            { title: 'Company', links: companyLinks },
            { title: 'Resources', links: resourceLinks },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-6 text-green-600 dark:text-green-500">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm sm:text-base">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 pb-6 border-t border-gray-200 dark:border-gray-800 text-center md:text-left"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Synapse. Empowering students for
              success.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(
                (item, i) => (
                  <Link
                    key={i}
                    to="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
