
import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@/types';
import { ExternalLink, Play } from 'lucide-react';

const Gallery = () => {
  const { items, isLoading } = usePortfolio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען את הגלריה...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">הגלריה ריקה</h2>
          <p className="text-muted-foreground">אין עדיין פריטים להצגה</p>
        </div>
      </div>
    );
  }

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const renderSelectedItemContent = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'image':
        return (
          <AspectRatio ratio={16/9}>
            <img 
              src={selectedItem.url} 
              alt={selectedItem.title} 
              className="w-full h-full object-contain" 
            />
          </AspectRatio>
        );
      case 'video':
        // This is a simplified video embed, you might want to improve it for production
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
            <ExternalLink className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">{selectedItem.title}</h3>
            {selectedItem.description && (
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
            )}
            <Button asChild>
              <a 
                href={selectedItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                פתח באתר חיצוני <ExternalLink className="w-4 h-4" />
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
        <h1 className="text-3xl font-bold">גלריית עבודות</h1>
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
      
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[800px]">
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
