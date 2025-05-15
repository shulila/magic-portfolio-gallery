
import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '@/types';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GalleryItem } from '@/components/GalleryItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const Gallery: React.FC = () => {
  const { items } = usePortfolio();
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [displayItems, setDisplayItems] = useState<PortfolioItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    loadMoreItems();
  }, [items]);

  const loadMoreItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);
    
    if (newItems.length > 0) {
      setDisplayItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
    }
    
    if (endIndex >= items.length) {
      setHasMore(false);
    }
  };

  const renderSelectedContent = () => {
    if (!selected) return null;

    switch (selected.type) {
      case 'image':
        return <img src={selected.url} alt={selected.title} className="max-h-[80vh] w-auto mx-auto" />;
      case 'video':
        return (
          <video
            src={selected.url}
            controls
            autoPlay
            className="max-h-[80vh] w-auto mx-auto rounded-md"
          />
        );
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
      default: // url
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
      <InfiniteScroll
        dataLength={displayItems.length}
        next={loadMoreItems}
        hasMore={hasMore}
        loader={<p className="text-center p-4">Loading more items...</p>}
        endMessage={
          <p className="text-center p-4 text-muted-foreground">
            No more items to display
          </p>
        }
      >
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4">
          {displayItems.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onPreview={setSelected}
            />
          ))}
        </div>
      </InfiniteScroll>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl">
          {renderSelectedContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
