
import React from 'react';
import { PortfolioItem } from '@/types';
import { Eye } from 'lucide-react';

interface GalleryItemProps {
  item: PortfolioItem;
  onPreview: (item: PortfolioItem) => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ 
  item,
  onPreview
}) => {
  const renderMedia = () => {
    switch (item.type) {
      case 'image':
        return (
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-auto object-cover rounded-lg" 
          />
        );
      case 'video':
        return (
          <video
            src={item.url}
            controls
            preload="metadata"
            className="w-full h-auto object-cover rounded-lg"
          />
        );
      case 'pdf':
        return (
          <div className="w-full h-40 bg-muted/30 flex items-center justify-center text-muted-foreground rounded-lg">
            <span className="text-lg font-medium">PDF</span>
          </div>
        );
      default: // url
        return (
          <div className="w-full h-40 bg-muted/30 flex items-center justify-center text-muted-foreground rounded-lg">
            <span className="text-lg font-medium">LINK</span>
          </div>
        );
    }
  };

  return (
    <div 
      className="relative cursor-pointer break-inside-avoid mb-4" 
      onClick={() => onPreview(item)}
    >
      {renderMedia()}
      
      {/* Hover overlay with eye icon */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40 flex items-center justify-center text-white rounded-lg">
        <Eye size={24} />
      </div>
    </div>
  );
};

export default GalleryItem;
