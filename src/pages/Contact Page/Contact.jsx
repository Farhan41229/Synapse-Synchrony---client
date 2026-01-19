import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      title: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04642a]/10 to-transparent dark:from-[#04642a]/20" />
        
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-up">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#04642a] to-[#15a33d] bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Have questions about Synapse Synchrony? Want to provide feedback or report an issue? 
                We're here to help!
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-[#04642a]/10 dark:bg-[#04642a]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#04642a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@synapsesynchrony.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-[#04642a]/10 dark:bg-[#04642a]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#04642a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">+880 1234-567890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-[#04642a]/10 dark:bg-[#04642a]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#04642a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Visit Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      United International University<br />
                      Madani Avenue, Dhaka 1212<br />
                      Bangladesh
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info Box */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#04642a]/10 to-[#15a33d]/5 dark:from-[#04642a]/20 dark:to-[#15a33d]/10 border border-[#04642a]/20">
                <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">
                  Response Time
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We aim to respond to all inquiries within 24-48 hours during business days. 
                  For urgent matters, please mark your message as priority.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div data-aos="fade-left">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#04642a] rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-900 dark:text-white">
                      Subject
                    </Label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                        placeholder:text-gray-500 dark:placeholder:text-gray-400
                        focus:border-[#04642a] focus:ring-2 focus:ring-[#04642a]/20 
                        outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-900 dark:text-white">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      required
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#04642a] hover:bg-[#15a33d] text-white font-semibold py-3 rounded-lg 
                      flex items-center justify-center gap-2 transition-all duration-300 
                      shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Before reaching out, check if your question is already answered in our FAQ section.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                How do I reset my password?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click on "Forgot Password" on the login page and follow the instructions sent to your email.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we use industry-standard encryption and security measures to protect your information.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Can I use this on mobile?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! Synapse Synchrony is fully responsive and works on all devices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                How do I chat with Whoop AI?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Navigate to the chat section and select "Whoop AI" from your contacts to start chatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Other Ways to Connect
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join our community and stay updated with the latest news and features
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white hover:border-[#04642a] hover:bg-[#04642a]/5 transition-all">
              Join our Discord
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white hover:border-[#04642a] hover:bg-[#04642a]/5 transition-all">
              Follow on Twitter
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white hover:border-[#04642a] hover:bg-[#04642a]/5 transition-all">
              GitHub Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
