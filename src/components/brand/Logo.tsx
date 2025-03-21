
import React from 'react';

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", 
  size = 48 
}) => {
  const ratio = size / 180;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 180 180" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Awesome Video logo"
    >
      <rect width="100%" height="100%" fill="#0B0D10"/>
      
      <line x1="60" y1="130" x2="100" y2="40" stroke="#FF2DA0" strokeWidth="6"/>
      <line x1="100" y1="40" x2="140" y2="130" stroke="#FF2DA0" strokeWidth="6"/>
      <line x1="70" y1="40" x2="100" y2="130" stroke="#00F0FF" strokeWidth="6"/>
      <line x1="100" y1="130" x2="130" y2="40" stroke="#00F0FF" strokeWidth="6"/>
      <line x1="80" y1="100" x2="120" y2="100" stroke="#00F0FF" strokeWidth="4"/>
    </svg>
  );
};

export const LogoText: React.FC<{ className?: string; width?: number }> = ({ 
  className = "", 
  width = 240
}) => {
  const ratio = width / 483;
  const height = 100 * ratio;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 483 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Awesome Video text logo"
    >
      <rect width="100%" height="100%" fill="#0B0D10"/>
      
      <text x="40" y="70" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#FF2DA0">AWESOME</text>
      <text x="298" y="70" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#00F0FF">VIDEO</text>
    </svg>
  );
};

export const LogoFull: React.FC<{ className?: string; width?: number }> = ({ 
  className = "", 
  width = 320
}) => {
  const ratio = width / 643;
  const height = 180 * ratio;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 643 180" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Awesome Video full logo"
    >
      <rect width="100%" height="100%" fill="#0B0D10"/>
      
      <line x1="60" y1="130" x2="100" y2="40" stroke="#FF2DA0" strokeWidth="6"/>
      <line x1="100" y1="40" x2="140" y2="130" stroke="#FF2DA0" strokeWidth="6"/>
      <line x1="70" y1="40" x2="100" y2="130" stroke="#00F0FF" strokeWidth="6"/>
      <line x1="100" y1="130" x2="130" y2="40" stroke="#00F0FF" strokeWidth="6"/>
      <line x1="80" y1="100" x2="120" y2="100" stroke="#00F0FF" strokeWidth="4"/>

      <text x="180" y="105" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#FF2DA0">AWESOME</text>
      <text x="448" y="105" fontFamily="Sora, sans-serif" fontSize="48" fontWeight="600" fill="#00F0FF">VIDEO</text>
    </svg>
  );
};

const Logo: React.FC<{ 
  type?: 'icon' | 'text' | 'full'; 
  className?: string;
  size?: number;
}> = ({ 
  type = 'full',
  className = "",
  size = 48
}) => {
  if (type === 'icon') {
    return <LogoIcon className={className} size={size} />;
  }
  
  if (type === 'text') {
    return <LogoText className={className} width={size * 5} />;
  }
  
  return <LogoFull className={className} width={size * 6.5} />;
};

export default Logo;
