
import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@/types';
import { ExternalLink, Play, ZoomIn, ZoomOut, X } from 'lucide-react';

const Gallery = () => {
  const { items, isLoading } = usePortfolio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus management for accessibility
  useEffect(() => {
    if (selectedItem && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedItem]);
  
  // Keyboard handling for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        setSelectedItem(null);
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען גלריה...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">הגלריה ריקה</h2>
          <p className="text-muted-foreground">אין פריטים להצגה כרגע</p>
        </div>
      </div>
    );
  }

  const handleItemPreview = (item: PortfolioItem) => {
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
      case 'pdf':
        return (
          <div className="relative h-[70vh]">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(selectedItem.url)}`}
              title={selectedItem.title}
            ></iframe>
          </div>
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
                פתח אתר חיצוני <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">גלריית עבודות</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <PortfolioItemCard 
            key={item.id} 
            item={item} 
            onPreview={handleItemPreview}
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
        <DialogContent 
          className={`sm:max-w-[800px] ${isFullscreen ? "max-w-[95vw]" : ""} animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]`}
        >
          {selectedItem && (
            <>
              <DialogHeader className="rtl">
                <DialogTitle>{selectedItem.title}</DialogTitle>
                <Button
                  ref={closeButtonRef}
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">סגור</span>
                </Button>
              </DialogHeader>
              <div className="py-4 rtl">
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
