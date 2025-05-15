import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '@/types';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GalleryItem } from '@/components/GalleryItem';
import InfiniteScroll from 'react-infinite-scroll-component';

/* ---------- helpers to detect direct media URLs ---------- */
const isImageUrl = (url: string) =>
  /\.(jpe?g|png|gif|bmp|webp|avif)$/i.test(new URL(url, window.location.href).pathname);

const isVideoUrl = (url: string) =>
  /\.(mp4|mov|webm|ogv)$/i.test(new URL(url, window.location.href).pathname);

const Gallery: React.FC = () => {
  const { items } = usePortfolio();

  /* pagination for infinite-scroll */
  const [displayItems, setDisplayItems] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 30;

  /* preview state */
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  /* reset pagination when DB items change */
  useEffect(() => {
    setDisplayItems(items.slice(0, itemsPerPage));
    setPage(2);
    setHasMore(items.length > itemsPerPage);
  }, [items]);

  const loadMore = () => {
    const start = (page - 1) * itemsPerPage;
    const next = items.slice(start, start + itemsPerPage);

    if (next.length) {
      setDisplayItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
    } else {
      setHasMore(false);
    }
  };

  /* ---------- preview renderer ---------- */
  const mediaCommon = 'max-h-[80vh] w-auto mx-auto rounded-md';

  const renderSelectedContent = () => {
    if (!selected) return null;

    switch (selected.type) {
      case 'image':
        return <img src={selected.url} alt={selected.title} className={mediaCommon} />;

      case 'video':
        return <video src={selected.url} controls autoPlay className={mediaCommon} />;

      case 'pdf':
        return (
          <iframe
            title={selected.title}
            src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
              selected.url,
            )}`}
            className="w-full h-[80vh] rounded-md"
          />
        );

      /* ---------- URL: try to treat it as media first ---------- */
      default: // 'url'
        if (isImageUrl(selected.url))
          return <img src={selected.url} alt={selected.title} className={mediaCommon} />;

        if (isVideoUrl(selected.url))
          return <video src={selected.url} controls autoPlay className={mediaCommon} />;

        /* fallback – real external page */
        return (
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Open link
          </a>
        );
    }
  };

  return (
    <>
      {/* masonry columns + infinite scroll */}
      <InfiniteScroll
        dataLength={displayItems.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p className="text-center p-4 text-muted-foreground">Loading…</p>}
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4"
      >
        {displayItems.map((it) => (
          <GalleryItem key={it.id} item={it} onPreview={setSelected} />
        ))}
      </InfiniteScroll>

      {/* preview dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl">{renderSelectedContent()}</DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
