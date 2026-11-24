'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MagneticCursor = dynamic(() => import('@/components/MagneticCursor'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const PageTransitionCurtain = dynamic(() => import('@/components/PageTransitionCurtain'), { ssr: false });

export default function AwwwardsEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (!isClient || isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageTransitionCurtain />
      <MagneticCursor />
      <div className="awwwards-noise" />
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </>
  );
}
