/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Heart, 
  ChevronRight, 
  Star, 
  Maximize2,
  Check,
  ChevronUp,
  Volume2,
  X
} from 'lucide-react';
import { Project } from '../types';
import { READER_PAGES } from '../mockData';

interface ReaderViewProps {
  project: Project | null;
  onExitReader: () => void;
}

export default function ReaderView({ project, onExitReader }: ReaderViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const activeProjectTitle = project?.name || 'Neon Drifters';

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const element = containerRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      
      if (scrollHeight > 0) {
        setScrollProgress((scrollTop / scrollHeight) * 100);
      }

      // Show/Hide header on scroll direction
      if (scrollTop > lastScrollTop.current && scrollTop > 80) {
        setHeaderVisible(false); // scrolling down, hide
      } else {
        setHeaderVisible(true); // scrolling up, show
      }
      
      lastScrollTop.current = scrollTop;
    };

    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleLikeClick = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121314] text-white flex flex-col select-none overflow-hidden font-sans">
      
      {/* Scroll indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-50">
        <div 
          className="bg-primary-container h-full transition-all duration-100 shadow-[0_0_8px_#7dd3fc]"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Floating Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 bg-[#18191b]/95 backdrop-blur-md border-b border-white/5 px-4 py-3.5 flex items-center justify-between transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={onExitReader}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-white leading-tight">{activeProjectTitle}</h1>
            <p className="text-[10px] font-bold text-white/55 uppercase tracking-wider mt-0.5">
              Chapter 42: The Final Pulse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl transition-all border-none cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isBookmarked 
                ? 'bg-primary-container text-on-primary-container font-extrabold shadow-sm' 
                : 'bg-white/5 hover:bg-white/10 text-white/80'
            }`}
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button 
            onClick={() => alert('Mock share URL copied to clipboard!')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Vertical reader canvas area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pt-24 pb-16 scroll-smooth flex flex-col items-center bg-[#0d0e0f]"
      >
        {/* Double-tap instructions overlay (brief) */}
        <div className="text-center py-2 text-white/40 text-[10px] font-medium tracking-wide">
          Vertical Scroll Mode Enabled
        </div>

        {/* Layout pages list */}
        <div className="w-full max-w-[620px] px-4 space-y-6">
          {READER_PAGES.map((page, idx) => (
            <div key={idx} className="relative group bg-[#161719] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <img 
                src={page.url} 
                alt={`Manga Page ${page.num}`} 
                className="w-full h-auto block select-none pointer-events-none"
              />
              {/* Page Number Watermark */}
              <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm text-[10px] font-bold text-white/70 tracking-wider">
                PAGE {page.num} / {READER_PAGES.length}
              </div>
            </div>
          ))}

          {/* Ending Chapter Completion Board Card */}
          <div className="bg-[#18191b] rounded-3xl p-8 border border-white/5 text-center space-y-6 mt-12 mb-8">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-primary-container uppercase tracking-wider">End of Chapter</span>
              <h2 className="text-2xl font-extrabold text-white">Chapter Complete!</h2>
              <p className="text-xs text-white/55 max-w-sm mx-auto">
                You have finished reading <span className="font-semibold text-white">Chapter 42</span>. Rate this chapter or support the original creators.
              </p>
            </div>

            {/* Rating Stars interaction */}
            <div className="space-y-4">
              {!rated ? (
                <div className="flex justify-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star);
                        setRated(true);
                      }}
                      className="p-1 hover:scale-110 transition-transform bg-transparent border-none cursor-pointer"
                    >
                      <Star 
                        size={28} 
                        className={star <= rating || rating === 0 ? 'text-amber-400 fill-amber-400' : 'text-white/20'} 
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-2xl p-4 inline-flex items-center gap-2 text-xs font-bold">
                  <Check size={16} /> Thanks for voting {rating} stars!
                </div>
              )}
            </div>

            {/* Next Chapter & Likes bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 max-w-sm mx-auto">
              <button 
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  hasLiked 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold' 
                    : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10'
                }`}
              >
                <Heart size={15} fill={hasLiked ? 'currentColor' : 'none'} />
                <span className="text-xs">{likes} Likes</span>
              </button>

              <button 
                onClick={onExitReader}
                className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 text-xs shadow-md cursor-pointer"
              >
                Exit Reader
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini scroll indicator button floating at bottom-right */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button 
          onClick={() => {
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className="w-10 h-10 rounded-full bg-[#1c1d1f] hover:bg-[#252629] border border-white/10 text-white/80 hover:text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
          title="Scroll to Top"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
}
