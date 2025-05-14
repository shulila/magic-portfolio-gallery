import React from 'react';
import { PortfolioItem } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExternalLink, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelative } from 'date-fns';
import { he } from 'date-fns/locale';

interface Props {
  item: PortfolioItem;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
  onClick?: (item: PortfolioItem) => void;
  onPreview?: (item: PortfolioItem) => void;
  isAdmin?: boolean;
}

const PortfolioItemCard: React.FC<Props> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onClick,
  onPreview,
  isAdmin
}) => {
  const renderPreview = () => {
    const className = "w-full h-full object-cover rounded";

    if (item.type === 'image') {
      return <img src={item.url} alt={item.title} className={className} />;
    }

    if (item.type === 'video') {
      return <video src={item.url} controls className={className} />;
    }

    if (item.type === 'pdf') {
      return <embed src={item.url} type="application/pdf" className={className} />;
    }

    if (item.type === 'url') {
      // Simple detection of image URL
      if (item.url.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
        return <img src={item.url} alt={item.title} className={className} />;
      }
      // Otherwise, show thumbnail preview (e.g., YouTube) or link icon
      return (
        <iframe
          src={item.url}
          className={className}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-xs overflow-hidden rounded-lg shadow bg-background border border-muted">
      <div 
        className="preview-box w-full h-56 bg-muted overflow-hidden flex items-center justify-center cursor-pointer" 
        onClick={() => {
          if (onPreview) {
            onPreview(item);
          } else if (onClick) {
            onClick(item);
          }
        }}
      >
        {renderPreview()}
      </div>

      <CardContent className="p-4 flex flex-col gap-2 text-right">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.type}</p>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs flex items-center gap-1">
            <ExternalLink size={12} />
          </a>
        )}
      </CardContent>

      {(onEdit || onDelete || onPreview) && (
        <CardFooter className="flex justify-between px-4 pb-4">
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Trash2 size={14} />
            </Button>
          )}
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(item);
              }}
            >
              <Eye size={14} />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Pencil size={14} />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioItemCard;
