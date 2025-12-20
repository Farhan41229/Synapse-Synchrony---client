import { Link } from 'react-router-dom';
import logo from '../../../assets/Logo/Rootfarming.png';

const HabitudeLogo = () => {
  return (
    <>
      <Link to="/">
        <div className="flex items-center justify-center gap-2 text-md md:text-lg lg:text-xl font-bold text-black dark:text-white">
          <img src={logo} className="w-8 h-8 rounded-full" />
          Synapse
        </div>
      </Link>
    </>
  );
};

export default HabitudeLogo;
