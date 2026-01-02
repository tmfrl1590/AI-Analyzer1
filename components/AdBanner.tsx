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
  format = "auto",
  responsive = true,
  className = "",
  isTestMode = true
}) => {
  // ins 요소를 참조하여 광고 상태를 확인합니다.
  const adInsRef = useRef<HTMLModElement>(null);
  // 중복 실행 방지를 위한 플래그
  const isAdPushed = useRef(false);

  useEffect(() => {
    // 슬롯이나 클라이언트 ID가 변경되면 초기화
    isAdPushed.current = false;
  }, [client, slot]);

  useEffect(() => {
    if (isTestMode) return;
    if (!client || client === "ca-pub-XXXXXXXXXXXXXXXX") return;

    // 이미 광고 요청을 보냈다면 중단 (React Strict Mode 대응)
    if (isAdPushed.current) return;

    // 이미 광고가 로드된 상태인지 확인 (data-ad-status 속성 확인)
    if (adInsRef.current && adInsRef.current.getAttribute('data-ad-status')) {
      isAdPushed.current = true;
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdPushed.current = true;
    } catch (e) {
      console.error("AdSense Push Error:", e);
    }
  }, [client, slot, isTestMode]);

  if (isTestMode) {
    return (
      <div className={`bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 p-4 ${className}`} style={{ minHeight: '280px', width: '100%' }}>
        <span className="font-medium text-sm">Google AdSense 영역</span>
        <span className="text-xs mt-1">반응형 디스플레이 광고</span>
        <span className="text-[10px] mt-2 text-slate-300">ID: {client.slice(7, 15)}... / Slot: {slot}</span>
      </div>
    );
  }

  return (
    <div 
      className={`ad-container flex justify-center items-center bg-slate-50 rounded-lg overflow-hidden ${className}`} 
      // 광고가 로드되지 않아도 공간을 차지하도록 minHeight 설정 (약 250px~280px 권장)
      style={{ minHeight: '280px', width: '100%' }}
    >
      <ins
        ref={adInsRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};