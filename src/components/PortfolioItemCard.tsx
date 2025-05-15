// src/components/PortfolioItemCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { PortfolioItem } from '@/types';

interface Props {
  item: PortfolioItem;
  onPreview?: (item: PortfolioItem) => void;   // ⬅️ תצוגה מוגדלת
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
  const handleClick = () => onPreview?.(item);

  const preview = (() => {
    const wrap = (el: React.ReactNode) => (
      <div className="preview-container">{el}</div>
    );

    switch (item.type) {
      case 'image':
        return wrap(<img src={item.url} alt={item.title} />);
      case 'video':
        return wrap(<video src={item.url} controls />);
      case 'pdf':
        return wrap(<embed src={item.url} type="application/pdf" />);
      case 'url':
        if (/\.(jpe?g|png|gif|webp)$/i.test(item.url))
          return wrap(<img src={item.url} alt={item.title} />);
        if (/\.(mp4|webm|ogg)$/i.test(item.url))
          return wrap(<video src={item.url} controls />);
        return wrap(
          <iframe
            src={item.url}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      default:
        return wrap(<div className="text-white">No preview</div>);
    }
  })();

  return (
    <Card className="aspect-square overflow-hidden flex flex-col group relative">
      <div className="flex-1 cursor-pointer" onClick={handleClick}>
        {preview}
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
