import React, { useState } from 'react';
import logoRPImg from '../assets/logo-rp.jpg';

interface LogoProps {
  variant?: 'default' | 'light' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTextFallback?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fallback image sources in order of priority
  const sources = [
    logoRPImg,
    '/logo-rp.jpg',
    '/logo-rp.png',
    '/logo.jpg',
  ];

  const currentSrc = sources[retryCount] || logoRPImg;

  const handleImageError = () => {
    if (retryCount < sources.length - 1) {
      setRetryCount((prev) => prev + 1);
    } else {
      setImgError(true);
    }
  };

  // Image height configurations
  const sizeConfig = {
    sm: 'h-7 sm:h-8 max-w-[130px]',
    md: 'h-9 sm:h-10 max-w-[180px]',
    lg: 'h-12 sm:h-14 max-w-[240px]',
    xl: 'h-16 sm:h-20 max-w-[320px]',
  }[size];

  if (variant === 'icon') {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    }[size];

    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 border border-slate-200 shadow-sm ${iconSizes} ${className}`}>
        {!imgError ? (
          <img
            src={currentSrc}
            alt="Rapid Pièces"
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-xs">
            RP
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      {!imgError ? (
        <div className="bg-white rounded-xl px-2.5 py-1 sm:py-1.5 shadow-sm border border-slate-200/90 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02] flex items-center justify-center">
          <img
            src={currentSrc}
            alt="Rapid Pièces - Pièces Auto, Livrées Rapidement"
            className={`w-auto object-contain ${sizeConfig}`}
            onError={handleImageError}
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-600/30">
            RP
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-white tracking-tight leading-none">
              RAPID <span className="text-red-500">PIÈCES</span>
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Pièces Auto Livrées
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

