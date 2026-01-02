import React, { useEffect, useRef, useState } from 'react';

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
  client = "ca-pub-XXXXXXXXXXXXXXXX",
  slot = "0000000000",
  format = "auto",
  responsive = true,
  className = "",
  isTestMode = false
}) => {
  const adInsRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    // 로컬 환경인지 체크
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setIsLocalhost(true);
      }
    }
  }, []);

  useEffect(() => {
    // 슬롯이나 클라이언트 ID가 변경되면 초기화
    isAdPushed.current = false;
  }, [client, slot]);

  useEffect(() => {
    // 1. 테스트 모드이거나 로컬 환경이면 실제 광고 요청 안 함
    if (isTestMode || isLocalhost) return;
    
    // 2. 필수 정보 누락 시 중단
    if (!client || client === "ca-pub-XXXXXXXXXXXXXXXX") return;

    // 3. 이미 요청했으면 중단 (Strict Mode 중복 방지)
    if (isAdPushed.current) return;

    // 4. 이미 광고가 로드된 상태인지 DOM 확인
    if (adInsRef.current && adInsRef.current.getAttribute('data-ad-status')) {
      isAdPushed.current = true;
      return;
    }

    try {
      // 5. 광고 푸시 시도
      if (typeof window.adsbygoogle === 'undefined') {
        // 스크립트가 아직 로드되지 않았거나 차단됨
        console.warn("Google AdSense script not loaded yet.");
      }
      
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdPushed.current = true;
    } catch (e) {
      console.error("AdSense Push Error:", e);
      setAdBlockDetected(true);
    }
  }, [client, slot, isTestMode, isLocalhost]);

  // Case 1: 테스트 모드일 때
  if (isTestMode) {
    return (
      <div className={`bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 p-4 ${className}`} style={{ minHeight: '280px', width: '100%' }}>
        <span className="font-medium text-sm">Google AdSense 영역 (테스트 모드)</span>
        <span className="text-[10px] mt-2 text-slate-300">ID: {client.slice(7, 15)}... / Slot: {slot}</span>
      </div>
    );
  }

  // Case 2: 로컬 호스트일 때 (실제 광고 안 나옴)
  if (isLocalhost) {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-center justify-center text-amber-700 p-6 ${className}`} style={{ minHeight: '280px', width: '100%' }}>
        <strong className="font-semibold text-lg mb-2">📢 광고 표시 불가 (Localhost)</strong>
        <p className="text-sm text-center mb-1">
          구글 애드센스는 <strong>localhost(내 컴퓨터)</strong>에서<br/> 실제 광고를 송출하지 않습니다.
        </p>
        <p className="text-xs text-amber-600 mt-2">
          * 실제 도메인에 배포(Vercel 등)하면 광고가 정상적으로 보입니다.<br/>
          * 현재 설정된 ID: {client} / {slot}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`ad-container flex justify-center items-center bg-slate-50 rounded-lg overflow-hidden ${className}`} 
      style={{ minHeight: '280px', width: '100%' }}
    >
      {adBlockDetected ? (
        <div className="text-xs text-slate-400 p-4">
          광고를 불러올 수 없습니다. (AdBlock 확인 필요)
        </div>
      ) : (
        <ins
          ref={adInsRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  );
};