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

const PortfolioItemCard: React.FC<Props> = ({
  item,
  onPreview,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  /* ---------- handlers ---------- */
  const handlePreview = () => onPreview?.(item);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  /* ---------- media renderer ---------- */
  const Media = () => {
    const common = 'w-full h-full object-cover rounded-t-lg';

    switch (item.type) {
      case 'image':
        return <img src={item.url} alt={item.title} className={common} />;
      case 'video':
        return (
          <video
            src={item.url}
            controls
            preload="metadata"
            className={common}
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
    <Card
      className="relative cursor-pointer select-none"
      onClick={handlePreview}
    >
      {/* ALWAYS 1×1 RATIO – uniform squares */}
      <AspectRatio ratio={1} className="w-full rounded-t-lg overflow-hidden">
        <Media />
      </AspectRatio>

      {/* footer bar */}
      <div className="flex items-center justify-between px-2 py-1 text-xs bg-primary/20 text-primary-foreground">
        <span className="truncate rtl:pl-1 ltr:pr-1">
          {item.title || item.type}
        </span>

        {isAdmin && (
          <span className="flex gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  stop(e);
                  onEdit(item);
                }}
                className="hover:text-primary"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  stop(e);
                  onDelete(item.id);
                }}
                className="hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            )}
            {onPreview && (
              <button
                onClick={(e) => {
                  stop(e);
                  onPreview(item);
                }}
                className="hover:text-primary"
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

export { PortfolioItemCard };
export default PortfolioItemCard;
