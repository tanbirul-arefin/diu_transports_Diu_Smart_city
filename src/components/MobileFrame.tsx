import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto my-3 w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-slate-800 border-[6px] border-slate-800 flex flex-col select-none">
      {/* Speaker / Dynamic Island Top Bar */}
      <div className="absolute top-4 inset-x-0 z-40 flex items-center justify-between px-7 text-[11px] font-bold text-slate-800 pointer-events-none">
        <span>9:41</span>
        {/* Dynamic Island Notch */}
        <div className="w-24 h-4 bg-black rounded-full mx-auto" />
        <div className="flex items-center gap-1.5 text-slate-700">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Screen Container */}
      <div className="relative w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col pt-7 no-scrollbar shadow-inner">
        {children}
      </div>

      {/* Home Indicator bar at the bottom */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-40">
        <div className="w-32 h-1 bg-slate-700 rounded-full" />
      </div>
    </div>
  );
};
