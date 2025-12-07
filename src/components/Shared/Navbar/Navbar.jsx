import HabitudeLogo from './HabitudeLogo';
import HamburgerButton from './HamburgerButton';
import NavMenuGeneral from './NavMenuGeneral';

const Navbar = () => {
  return (
    // Changed fixed to sticky. Added adaptive background colors.
    <nav
      className="sticky top-0 w-full z-50 backdrop-blur-md 
      bg-white/80 border-b border-gray-200 
      dark:bg-[#111827]/90 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <HabitudeLogo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <NavMenuGeneral />
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden">
          <HamburgerButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
