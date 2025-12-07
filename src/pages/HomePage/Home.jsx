import BecomePartner from './BecomeAPartner';
import FarmerSuccessStoriesSection from './FarmerSuccessStories';
import Features from './Features';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import OurTrustedPartnersSection from './OurTrustedPartners';
import Services from './Services';

const Home = () => {
  return (
    <>
      {/* <MarqueeSection /> */}
      <HeroSection />
      {/* <WeatherForecastSection /> */}
      <Features />
      <HowItWorks />
      {/* <AdvertisementSection /> */}
      <Services />
      {/* <LatestReviews /> */}
      <FarmerSuccessStoriesSection />
      {/* <OurTrustedPartnersSection /> */}
      <BecomePartner />
    </>
  );
};

export default Home;
