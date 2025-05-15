
import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioItem } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink, FileText } from 'lucide-react';

const Gallery = () => {
  const { displayItems } = usePortfolio();
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const handleClose = () => setPreviewItem(null);

  const renderPreview = (item: PortfolioItem) => {
    const base = 'max-w-full max-h-[80vh] rounded';
    switch (item.type) {
      case 'image':
        return <img src={item.url} alt={item.title} className={base} />;
      case 'video':
        return (
          <video
            src={item.url}
            controls
            autoPlay
            className={`${base} bg-black`}
          />
        );
      case 'pdf':
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(item.url)}&embedded=true`}
            title={item.title}
            className="w-[90vw] h-[80vh] border-none rounded bg-white"
          />
        );
      case 'url':
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted rounded">
            <ExternalLink size={32} />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-sm"
            >
              Open link
            </a>
          </div>
        );
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer"
            onClick={() => setPreviewItem(item)}
          >
            <div className="aspect-square overflow-hidden rounded bg-muted flex items-center justify-center">
              {item.type === 'image' && (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              {item.type === 'video' && (
                <video
                  src={item.url}
                  preload="metadata"
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              {item.type === 'pdf' && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <FileText size={32} />
                  PDF
                </div>
              )}
              {item.type === 'url' && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ExternalLink size={32} />
                  LINK
                </div>
              )}
            </div>
            <div className="text-xs text-center mt-1 truncate">{item.title || item.type}</div>
          </div>
        ))}
      </div>

      <Dialog open={!!previewItem} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] flex items-center justify-center p-4">
          {previewItem && renderPreview(previewItem)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
