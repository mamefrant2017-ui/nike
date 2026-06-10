import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function DeviceFrame({ children, activeTab, setActiveTab, onBack, canGoBack }: DeviceFrameProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="device-shell" className="relative mx-auto max-w-[412px] h-[844px] bg-neutral-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50 flex flex-col overflow-hidden">
      {/* Speaker and Camera Punch Hole (Notch) */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-50 flex items-center justify-center p-1">
        <div className="w-12 h-1 bg-neutral-800 rounded-full mr-2"></div>
        <div className="w-2.5 h-2.5 bg-neutral-950 rounded-full border border-neutral-800"></div>
      </div>

      {/* Internal Phone screen */}
      <div className="w-full h-full bg-white rounded-[34px] flex flex-col overflow-hidden relative selection:bg-neutral-800 selection:text-white">
        
        {/* Status Bar */}
        <div className="h-10 px-6 pt-3 flex justify-between items-center bg-white text-neutral-900 text-xs font-semibold z-40 select-none">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
            <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <Battery className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Dynamic App Header with Back Support */}
        {canGoBack && (
          <div className="px-4 py-2 bg-white flex items-center gap-3 border-b border-neutral-100 z-30">
            <button 
              id="back-button"
              onClick={onBack}
              className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-900" />
            </button>
            <span className="font-semibold text-neutral-900 text-sm">Back to explore</span>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 px-0 flex flex-col relative">
          {children}
        </div>

        {/* Virtual Home Navigation Indicator pill */}
        <div className="h-6 w-full bg-white flex items-center justify-center z-40 select-none">
          <div className="w-32 h-1 bg-neutral-800 rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
