/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Share2,
} from "lucide-react";
import { Chapter, MangaPage, Project } from "../types";

interface ReaderViewProps {
  project: Project | null;
  chapter: Chapter | null;
  chapters: Chapter[];
  pages: MangaPage[];
  onSelectChapter: (chapter: Chapter) => void;
  onExitReader: () => void;
}

export default function ReaderView({
  project,
  chapter,
  chapters,
  pages,
  onSelectChapter,
  onExitReader,
}: ReaderViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const readableChapters = useMemo(
    () =>
      chapters
        .filter((item) => item.mangaId === project?.id && item.status === "PUBLISHED")
        .sort((a, b) => a.chapterNumber - b.chapterNumber),
    [chapters, project?.id],
  );

  const activeChapter = chapter || readableChapters[0] || null;
  const activeChapterIndex = activeChapter
    ? readableChapters.findIndex((item) => item.id === activeChapter.id)
    : -1;
  const previousChapter =
    activeChapterIndex > 0 ? readableChapters[activeChapterIndex - 1] : null;
  const nextChapter =
    activeChapterIndex >= 0 && activeChapterIndex < readableChapters.length - 1
      ? readableChapters[activeChapterIndex + 1]
      : null;
  const chapterPages = activeChapter
    ? pages.filter((page) => page.projectId === activeChapter.id)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;

      if (scrollHeight > 0) {
        setScrollProgress((scrollTop / scrollHeight) * 100);
      }

      setHeaderVisible(scrollTop <= lastScrollTop.current || scrollTop <= 80);
      lastScrollTop.current = scrollTop;
    };

    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [activeChapter?.id]);

  const chapterPosition =
    activeChapterIndex >= 0 ? `${activeChapterIndex + 1}/${readableChapters.length}` : "0/0";

  return (
    <div className="fixed inset-0 z-50 bg-[#121314] text-white flex flex-col select-none overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-50">
        <div
          className="bg-primary-container h-full transition-all duration-100 shadow-[0_0_8px_#7dd3fc]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-[#18191b]/95 backdrop-blur-md border-b border-white/5 px-4 py-3.5 flex items-center justify-between transition-transform duration-300 ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onExitReader}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
            title="Quay lại danh sách chương"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-white leading-tight truncate">
              {project?.name || "Manga"}
            </h1>
            <p className="text-[10px] font-bold text-white/55 uppercase tracking-wider mt-0.5 truncate">
              {activeChapter
                ? `Chương ${activeChapter.chapterNumber}: ${activeChapter.title}`
                : "Chưa có chương public"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl transition-all border-none cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isBookmarked
                ? "bg-primary-container text-on-primary-container font-extrabold shadow-sm"
                : "bg-white/5 hover:bg-white/10 text-white/80"
            }`}
          >
            <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
            {isBookmarked ? "Đã lưu" : "Đánh dấu"}
          </button>

          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors border-none cursor-pointer"
            title="Sao chép liên kết"
          >
            <Share2 size={16} />
          </button>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pt-24 pb-16 scroll-smooth flex flex-col items-center bg-[#0d0e0f]"
      >
        <div className="text-center py-2 text-white/40 text-[10px] font-medium tracking-wide">
          Chế độ đọc cuộn dọc
        </div>

        {readableChapters.length > 0 && (
          <div className="w-full max-w-[720px] px-4 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {readableChapters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectChapter(item)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeChapter?.id === item.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  Chương {item.chapterNumber}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeChapter ? (
          <div className="w-full max-w-[720px] px-4 space-y-6">
            <article className="bg-[#18191b] border border-white/5 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-primary-container uppercase tracking-wider">
                    Chương {activeChapter.chapterNumber} · {chapterPosition}
                  </p>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {activeChapter.title}
                  </h2>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-white/45">
                  {chapterPages.length} trang
                </span>
              </div>

              {activeChapter.content ? (
                <p className="text-sm leading-7 text-white/75 mt-4 whitespace-pre-wrap">
                  {activeChapter.content}
                </p>
              ) : (
                <p className="text-sm leading-7 text-white/45 mt-4">
                  Chương này chưa có phần nội dung chữ.
                </p>
              )}
            </article>

            {chapterPages.length > 0 ? (
              chapterPages.map((page, index) => (
                <div
                  key={page.id}
                  className="relative group bg-[#161719] rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
                >
                  <img
                    src={page.imageUrl}
                    alt={page.fileName || `Trang ${index + 1}`}
                    className="w-full h-auto block select-none pointer-events-none"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm text-[10px] font-bold text-white/70 tracking-wider">
                    TRANG {index + 1} / {chapterPages.length}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#161719] rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/45">
                Chưa có trang ảnh public cho chương này.
              </div>
            )}

            <div className="bg-[#18191b] rounded-3xl p-8 border border-white/5 text-center space-y-6 mt-12 mb-8">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-primary-container uppercase tracking-wider">
                  Hết chương truyện
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Đã hoàn thành chương {activeChapter.chapterNumber}
                </h2>
                <p className="text-xs text-white/55 max-w-sm mx-auto">
                  Bạn đã đọc xong{" "}
                  <span className="font-semibold text-white">
                    {activeChapter.title}
                  </span>{" "}
                  trong project{" "}
                  <span className="font-semibold text-white">{project?.name}</span>.
                </p>
                <p className="text-[10px] text-white/35">
                  Vị trí chương: {chapterPosition}. Tổng chương public: {readableChapters.length}.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-6 border-t border-white/5 max-w-md mx-auto">
                <button
                  onClick={() => previousChapter && onSelectChapter(previousChapter)}
                  disabled={!previousChapter}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-xs font-bold"
                >
                  <ChevronLeft size={14} />
                  Chương trước
                </button>

                <button
                  onClick={() => (nextChapter ? onSelectChapter(nextChapter) : onExitReader())}
                  className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 text-xs shadow-md cursor-pointer"
                >
                  {nextChapter ? `Chương ${nextChapter.chapterNumber}` : "Về danh sách chương"}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[620px] px-4">
            <div className="bg-[#18191b] border border-white/5 rounded-2xl p-10 text-center text-white/55">
              Project này chưa có chapter public để đọc.
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className="w-10 h-10 rounded-full bg-[#1c1d1f] hover:bg-[#252629] border border-white/10 text-white/80 hover:text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
          title="Cuộn lên đầu trang"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
}
