import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Eye, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import { PortfolioItem } from '@/types';

interface Props {
  item: PortfolioItem;
  onPreview?: (item: PortfolioItem) => void;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const PortfolioItemCard: React.FC<Props> = ({
  item,
  onPreview,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const handleCardClick = () => {
    if (onPreview) onPreview(item);
  };

  const renderMedia = () => {
    switch (item.type) {
      case 'image':
        return (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        );
      case 'video':
        return (
          <video
            src={item.url}
            controls
            preload="metadata"
            className="w-full h-full object-cover rounded-t-lg"
          />
        );
      case 'pdf':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-muted/40 text-muted-foreground rounded-t-lg">
            <FileText size={32} className="mb-1" />
            PDF
          </div>
        );
      default: // 'url'
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-muted/40 text-muted-foreground rounded-t-lg">
            <ExternalLink size={32} className="mb-1" />
            LINK
          </div>
        );
    }
  };

  return (
    <Card className="relative cursor-pointer select-none" onClick={handleCardClick}>
      <AspectRatio
        ratio={item.type === 'image' ? 1 : 16 / 9}
        className="w-full rounded-t-lg overflow-hidden"
      >
        {renderMedia()}
      </AspectRatio>

      {/* TITLE BAR */}
      <div className="flex items-center justify-between px-2 py-1 text-xs bg-primary/20 text-primary-foreground">
        <span className="truncate rtl:pl-1 ltr:pr-1">{item.title || item.type}</span>

        {isAdmin && (
          <span className="flex gap-1">
            {onEdit && (
              <button
                type="button"
                className="hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
            {onPreview && (
              <button
                type="button"
                className="hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
              >
                <Eye size={14} />
              </button>
            )}
          </span>
        )}
      </div>
    </Card>
  );
};
