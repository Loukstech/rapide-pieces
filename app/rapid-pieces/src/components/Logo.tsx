'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { height: 32, className: 'h-8' },
  md: { height: 40, className: 'h-10' },
  lg: { height: 60, className: 'h-15' },
  xl: { height: 80, className: 'h-20' },
};

export default function Logo({ size = 'md', href, showText = false, className = '' }: LogoProps) {
  const { height, className: sizeClass } = sizeMap[size];
  
  const img = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo_rapidePiece.jpeg"
        alt="Rapid Pièces"
        width={height * 3}
        height={height}
        className={`${sizeClass} w-auto object-contain`}
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-rp-text leading-tight" style={{ fontSize: `${Math.max(14, height * 0.35)}px` }}>
            Rapid Pièces
          </span>
          <span className="text-rp-text-muted leading-tight" style={{ fontSize: `${Math.max(9, height * 0.2)}px` }}>
            Trouvez. Comparez. Recevez.
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{img}</Link>;
  }
  
  return img;
}
