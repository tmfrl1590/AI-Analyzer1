import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  client?: string; // ca-pub-XXXXXXXXXXXXXXXX
  slot?: string;   // Ad Unit ID
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  responsive?: boolean;
  className?: string;
  isTestMode?: boolean; // If true, shows a placeholder instead of trying to load ads
}

export const AdBanner: React.FC<AdBannerProps> = ({
  client = "ca-pub-XXXXXXXXXXXXXXXX", // Default placeholder
  slot = "0000000000", // Default placeholder
  format = "auto", // Changed default to auto for horizontal banners
  responsive = true,
  className = "",
  isTestMode = true // 기본값은 테스트 모드로 설정하여 레이아웃 확인
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 테스트 모드가 아니고, 클라이언트 ID가 설정되어 있을 때만 광고 스크립트 실행
    if (!isTestMode && client !== "ca-pub-XXXXXXXXXXXXXXXX") {
      try {
        const pushAd = () => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        };
        pushAd();
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [client, slot, isTestMode]);

  if (isTestMode) {
    return (
      <div className={`bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 p-4 ${className}`} style={{ minHeight: '120px', width: '100%' }}>
        <span className="font-medium text-sm">Google AdSense 영역</span>
        <span className="text-xs mt-1">반응형 디스플레이 광고 (하단 배치)</span>
        <span className="text-[10px] mt-2 text-slate-300">ID: {client.slice(7, 15)}... / Slot: {slot}</span>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className} overflow-hidden`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};