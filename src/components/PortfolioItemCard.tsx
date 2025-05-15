
// src/components/PortfolioItemCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, FileText } from 'lucide-react';
import { PortfolioItem } from '@/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Props {
  item: PortfolioItem;
  onPreview?: (item: PortfolioItem) => void;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const PortfolioItemCard: React.FC<Props> = ({
  item,
  onPreview,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const handleClick = () => {
    if (onPreview) {
      onPreview(item);
    }
  };

  const renderPreview = () => {
    switch (item.type) {
      case 'image':
        return (
          <AspectRatio ratio={1} className="w-full">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover rounded-t-lg" 
            />
          </AspectRatio>
        );
      case 'video':
        return (
          <AspectRatio ratio={16/9} className="w-full">
            <video 
              src={item.url} 
              preload="metadata" 
              className="w-full h-full object-cover rounded-t-lg"
            />
          </AspectRatio>
        );
      case 'pdf':
        return (
          <AspectRatio ratio={1} className="w-full">
            <div className="flex flex-col items-center justify-center w-full h-full bg-muted/40 text-muted-foreground">
              <FileText size={32} className="mb-2" />
              PDF
            </div>
          </AspectRatio>
        );
      case 'url':
        if (/\.(jpe?g|png|gif|webp)$/i.test(item.url)) {
          return (
            <AspectRatio ratio={1} className="w-full">
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-t-lg"
              />
            </AspectRatio>
          );
        }
        if (/\.(mp4|webm|ogg)$/i.test(item.url)) {
          return (
            <AspectRatio ratio={16/9} className="w-full">
              <video 
                src={item.url} 
                preload="metadata"
                className="w-full h-full object-cover rounded-t-lg"
              />
            </AspectRatio>
          );
        }
        return (
          <AspectRatio ratio={1} className="w-full">
            <iframe
              src={item.url}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full rounded-t-lg"
            />
          </AspectRatio>
        );
      default:
        return (
          <AspectRatio ratio={1} className="w-full">
            <div className="flex items-center justify-center h-full bg-secondary/20 text-muted-foreground">
              No preview
            </div>
          </AspectRatio>
        );
    }
  };

  return (
    <Card className="aspect-square sm:aspect-auto overflow-hidden flex flex-col group relative">
      <div className="flex-1 cursor-pointer" onClick={handleClick}>
        {renderPreview()}
      </div>
      <div className="p-2 bg-[#2b2042] text-right text-white text-sm">
        <div className="flex justify-between">
          <span className="truncate">{item.title}</span>
          <span className="text-xs lowercase opacity-70">{item.type}</span>
        </div>
      </div>

      {isAdmin && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(item)}>
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => item.id && onDelete?.(item.id)}
          >
            <Trash2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onPreview?.(item)}>
            <Eye size={16} />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PortfolioItemCard;
