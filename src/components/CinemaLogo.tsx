import React from 'react'
import { useNavigate } from 'react-router'

interface CinemaLogoProps {
  size?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

export const CinemaLogo: React.FC<CinemaLogoProps> = ({
  size = 'w-24 h-24',
  sm,
  md,
  lg,
  xl,
}) => {
  const responsiveClasses = [
    size, // (default)
    sm && `sm:${sm}`, // sm
    md && `md:${md}`, // md
    lg && `lg:${lg}`, // lg
    xl && `xl:${xl}`, // xl
  ]
    .filter(Boolean) // delete undefined
    .join(' '); // join classes

  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate('home');
    }
  };

  return (
    <img
      src="/cinema-logo.png"
      alt="Logotipo de Cinema Space"
      onClick={() => navigate('home')}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`cursor-pointer flex bg-white rounded object-contain ${responsiveClasses}`}
    />
  );
};

export default CinemaLogo;
