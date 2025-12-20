import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServiceCard = ({ icon: Icon, title, description, features, color = 'bg-[#EF4444]' }) => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  return (
    <div
      data-aos="zoom-in-up"
      className="rounded-2xl p-6 sm:p-8 bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 
      backdrop-blur-md shadow-sm hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)] 
      hover:-translate-y-2 transition-all duration-300 flex flex-col h-full text-black dark:text-gray-300"
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl ${color} flex items-center justify-center mb-5 
        shadow-md transition-transform duration-300 group-hover:scale-110`}
      >
        {Icon ? <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" /> : null}
      </div>

      <h3 className="text-lg md:text-xl font-semibold mb-2 hover:text-[#EF4444] dark:hover:text-[#EF4444] transition-colors duration-300">
        {title}
      </h3>

      <p className="text-sm md:text-base text-black dark:text-gray-400 mb-4 flex-grow">
        {description}
      </p>

      {features?.length > 0 && (
        <ul className="space-y-2 text-sm text-black dark:text-gray-400">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span className="w-2 h-2 bg-[#EF4444] rounded-full mt-1.5 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceCard;
