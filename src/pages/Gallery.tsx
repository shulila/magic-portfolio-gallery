
import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@/types';
import { ExternalLink, Play, ZoomIn, ZoomOut } from 'lucide-react';

const Gallery = () => {
  const { items, isLoading } = usePortfolio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Gallery is Empty</h2>
          <p className="text-muted-foreground">There are no items to display yet</p>
        </div>
      </div>
    );
  }

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderSelectedItemContent = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'image':
        return (
          <div className="relative">
            <AspectRatio ratio={isFullscreen ? undefined : 16/9} className={isFullscreen ? "h-[calc(100vh-200px)]" : ""}>
              <img 
                src={selectedItem.url} 
                alt={selectedItem.title} 
                className={`w-full h-full ${isFullscreen ? "object-contain" : "object-cover"}`}
              />
            </AspectRatio>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </Button>
          </div>
        );
      case 'video':
        return (
          <AspectRatio ratio={16/9}>
            <iframe 
              src={selectedItem.url.includes('youtube') ? 
                selectedItem.url.replace('watch?v=', 'embed/') : selectedItem.url} 
              title={selectedItem.title}
              className="w-full h-full" 
              allowFullScreen
            ></iframe>
          </AspectRatio>
        );
      case 'url':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-secondary/30 p-8 rounded-full mb-4">
              <ExternalLink className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">{selectedItem.title}</h3>
            {selectedItem.description && (
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
            )}
            <Button asChild className="bg-primary/90 hover:bg-primary">
              <a 
                href={selectedItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Open External Site <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Gallery</h1>
      </div>
      
      <div className="gallery-grid">
        {items.map((item) => (
          <PortfolioItemCard 
            key={item.id} 
            item={item} 
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      
      <Dialog 
        open={!!selectedItem} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setIsFullscreen(false);
          }
        }}
      >
        <DialogContent className={`sm:max-w-[800px] ${isFullscreen ? "max-w-[95vw]" : ""}`}>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {renderSelectedItemContent()}
                {selectedItem.description && selectedItem.type !== 'url' && (
                  <p className="mt-4 text-muted-foreground">{selectedItem.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
