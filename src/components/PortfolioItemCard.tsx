import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { PortfolioItem } from '@/types';

interface Props {
  item: PortfolioItem;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
  onPreview?: (item: PortfolioItem) => void;
  isAdmin?: boolean;
}

const PortfolioItemCard: React.FC<Props> = ({
  item,
  onEdit,
  onDelete,
  onPreview,
  isAdmin = false,
}) => {
  const renderPreview = () => {
    const commonStyle = 'object-cover w-full h-full rounded-t-lg';

    if (item.type === 'image') {
      return <img src={item.url} alt={item.title} className={commonStyle} />;
    } else if (item.type === 'video') {
      return <video src={item.url} className={commonStyle} controls />;
    } else if (item.type === 'pdf') {
      return (
        <embed
          src={item.url}
          type="application/pdf"
          className={commonStyle}
        />
      );
    } else if (item.type === 'url') {
      if (item.url.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
        return <img src={item.url} alt={item.title} className={commonStyle} />;
      } else if (item.url.match(/\.(mp4|webm|ogg)$/)) {
        return <video src={item.url} className={commonStyle} controls />;
      } else {
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
            <Eye className="w-6 h-6 opacity-50" />
          </div>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <Card className="overflow-hidden group relative aspect-square flex flex-col">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          if (onPreview) onPreview(item);
        }}
      >
        {renderPreview()}
      </div>

      <div className="p-2 bg-[#2b2042] text-right text-white text-sm">
        <div className="flex justify-between items-center">
          <div>{item.title}</div>
          <div className="text-muted-foreground text-xs lowercase">{item.type}</div>
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground block mt-1"
          >
            ↗
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="absolute inset-0 hidden group-hover:flex justify-center items-center gap-2 bg-black/50 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (item.id) onDelete?.(item.id);
            }}
          >
            <Trash2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(item);
            }}
          >
            <Eye size={16} />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default PortfolioItemCard;
