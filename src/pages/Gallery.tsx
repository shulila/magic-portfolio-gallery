import React, { useState } from 'react';
import { PortfolioItem } from '@/types';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PortfolioItemCard } from '@/components/PortfolioItemCard';

const Gallery: React.FC = () => {
  const { items } = usePortfolio();
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
        {items.map((item) => (
          <PortfolioItemCard
            key={item.id}
            item={item}
            onPreview={setSelected}
          />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl">
          {renderSelectedContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
