'use client';

import Image from 'next/image';

interface Screenshot {
  src: string;
  label: string;
  date: string;
  caption: string;
}

interface ScreenshotTimelineProps {
  screenshots: Screenshot[];
}

export default function ScreenshotTimeline({ screenshots }: ScreenshotTimelineProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0">
      {screenshots.map((shot, index) => {
        const isFirst = index === 0;
        const isLast = index === screenshots.length - 1;

        return (
          <div key={shot.src} className="flex flex-col sm:flex-row items-stretch flex-1 min-w-0">
            {/* Screenshot card */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isFirst
                      ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                      : 'text-violet-400 bg-violet-400/10 border-violet-400/20'
                  }`}
                >
                  {shot.label}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{shot.date}</span>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-slate-950 h-[280px]">
                <Image
                  src={shot.src}
                  alt={shot.label}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>

              <p className="text-xs text-slate-500 mt-1.5">{shot.caption}</p>
            </div>

            {/* Arrow between items */}
            {!isLast && (
              <div className="flex sm:flex-col items-center justify-center sm:px-4 py-2 sm:py-0">
                <span className="text-slate-700 text-lg font-mono rotate-90 sm:rotate-0">→</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
