import { NavLink } from 'react-router-dom';

const NavButton = ({
  label,
  icon: Icon,
  address,
  onClick,
  textSize = 'base',
}) => {
  return (
    <NavLink
      to={address}
      onClick={onClick}
      className={({ isActive }) => `
        btn bg-transparent border-0 shadow-none tracking-wider text-${textSize} flex items-center gap-2 transition-colors duration-200
        ${
          isActive
            ? 'text-[#097133] font-semibold' // Active state color
            : 'text-gray-700 hover:text-[#097133] dark:text-gray-200 dark:hover:text-[#097133]' // Default & Hover
        }
      `}
    >
      {Icon && <Icon size={20} />}
      {label}
    </NavLink>
  );
};

export default NavButton;
