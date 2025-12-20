import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BarChart2, BookOpen, Calendar, FileText, MessageCircle, Target, Users } from 'lucide-react';

import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    icon: Users,
    path: '/community',
    title: 'Community Hub',
    desc: 'Engage with peers, share progress, and foster collaboration.',
  },
  {
    icon: MessageCircle,
    path: '/inclusive-chat',
    title: 'Messaging',
    desc: 'Connect with friends or mentors to stay motivated and share insights.',
  },
  {
    icon: Target,
    path: '/goals',
    title: 'Goal Setting',
    desc: 'Set personal or collaborative goals for growth and progress.',
  },
  {
    icon: Calendar,
    path: '/events',
    title: 'Campus Events',
    desc: 'Stay updated on campus activities and important events.',
  },
  {
    icon: BarChart2,
    path: '/dashboard',
    title: 'Progress Tracker',
    desc: 'Monitor your progress and trends with insightful analytics.',
  },
  {
    icon: BookOpen,
    path: '/journal',
    title: 'Journal & Notes',
    desc: 'Reflect on your experiences and log thoughts alongside goals.',
  },
  {
    icon: FileText,
    path: '/resources',
    title: 'Resources',
    desc: 'Access guides, tools, and materials to support your journey.',
  },
  {
    icon: Award,
    path: '/achievements',
    title: 'Achievements',
    desc: 'Earn rewards and recognition for milestones and successes.',
  },
];

const Features = () => {
  const navigate = useNavigate(); // ✅ hook is inside the component [page:3]

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  const handleClick = (path, e) => {
    e.preventDefault();

    if (path === 'reviews') {
      const section = document.getElementById('Latest-reviews');
      section?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(path);
  };

  return (
    <div className="min-h-screen py-16 md:py-24 flex items-center transition-colors duration-300 ease-in-out bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Tools to Foster Growth and Connection
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            All-in-one dashboard for well-being, collaboration, and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {features.map(({ title, desc, path, icon: Icon }, i) => (
            <div
              key={i}
              onClick={(e) => handleClick(path, e)}
              data-aos="zoom-in"
              data-aos-delay={i * 100}
              className="cursor-pointer rounded-2xl p-6 sm:p-8 bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20
              backdrop-blur-md shadow-2xl hover:shadow-[0_10px_30px_rgba(68,239,68,0.2)]
              hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#04642a] flex items-center justify-center mb-5 shadow-md transition-transform duration-300">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <h3 className="text-lg md:text-xl font-semibold mb-2 transition-colors duration-300">
                {title}
              </h3>

              <p className="text-sm md:text-base flex-grow text-gray-700 dark:text-gray-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
