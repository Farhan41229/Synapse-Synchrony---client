import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import {
  Calendar,
  Clock,
  Heart,
  Eye,
  User,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router';
import { format } from 'date-fns';

const Blog = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch popular blogs
  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['popularBlogs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/portal/blogs/popular?limit=4');
      return response.data.data;
    },
  });

  // Fetch upcoming events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/portal/events/upcoming?limit=4',
      );
      return response.data.data;
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#04642a]/10 to-transparent dark:from-[#04642a]/20">
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-[#04642a]/10 dark:bg-[#04642a]/20 border border-[#04642a]/20">
              <Sparkles className="w-4 h-4 text-[#04642a]" />
              <span className="text-sm font-medium text-[#04642a] dark:text-[#15a33d]">
                Campus Hub
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#04642a] to-[#15a33d] bg-clip-text text-transparent">
              SynapsePortal
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              Your hub for campus stories, events, and community engagement
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover inspiring student blogs, upcoming campus events, and
              connect with your community
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <TrendingUp className="w-8 h-8 text-[#04642a] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                150+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Blog Posts
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <Calendar className="w-8 h-8 text-[#04642a] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Events
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <Users className="w-8 h-8 text-[#04642a] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                1000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Students
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <Heart className="w-8 h-8 text-[#04642a] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                5000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Interactions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="flex items-center justify-between mb-12"
            data-aos="fade-up"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Popular Blog Posts
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Trending stories from our student community
              </p>
            </div>
            <Link
              to="/blog/all"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
            >
              View All Blogs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 h-48 rounded-t-xl" />
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogsData?.map((blog, index) => (
                <div
                  key={blog._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        blog.image || 'https://i.ibb.co.com/QvRXjjrG/Study.webp'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#04642a] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {blog.content}
                    </p>

                    {/* Author & Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author?.name || 'Anonymous'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>
                            {blog.likeCount || blog.likes?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views || 0}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-[#04642a] dark:text-[#15a33d] font-medium text-sm hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden" data-aos="fade-up">
            <Link
              to="/blog/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
            >
              View All Blogs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div
            className="flex items-center justify-between mb-12"
            data-aos="fade-up"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Upcoming Events
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Don't miss out on exciting campus activities
              </p>
            </div>
            <Link
              to="/blog/events/all"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 h-48 rounded-t-xl" />
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventsData?.map((event, index) => (
                <div
                  key={event._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        event.image ||
                        'https://i.ibb.co.com/rKJX4Dsp/Evening.webp'
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                        {event.eventType}
                      </span>
                    </div>
                    {event.capacity && event.isFull && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                          Full
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#04642a] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-[#04642a]" />
                        <span>
                          {format(new Date(event.startDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-[#04642a]" />
                        <span>
                          {format(new Date(event.startDate), 'hh:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-[#04642a]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.registeredCount ||
                            event.registeredUsers?.length ||
                            0}
                          {event.capacity && ` / ${event.capacity}`}
                        </span>
                      </div>
                      <Link
                        to={`/blog/events/${event._id}`}
                        className="text-[#04642a] dark:text-[#15a33d] font-medium text-sm hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden" data-aos="fade-up">
            <Link
              to="/blog/events/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#04642a] to-[#15a33d]">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Join the Conversation
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Share your experiences, discover events, and connect with your
            campus community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blog/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#04642a] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Write a Blog
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/blog/events/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all shadow-lg"
            >
              Create Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
