import React from 'react';
import { PortfolioItem } from '@/types';
import { ExternalLink, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: number) => void;
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
    const commonProps = {
      className: 'w-full h-full object-cover rounded-t-md',
    };

    switch (item.type) {
      case 'image':
        return <img src={item.url} alt={item.title} {...commonProps} />;
      case 'video':
        return (
          <video controls {...commonProps}>
            <source src={item.url} />
          </video>
        );
      case 'pdf':
        return (
          <embed src={item.url} type="application/pdf" {...commonProps} />
        );
      case 'url':
        return (
          <iframe src={item.url} {...commonProps} sandbox="allow-scripts allow-same-origin" />
        );
      default:
        return <div className="flex items-center justify-center w-full h-full text-sm">No preview</div>;
    }
  };

  return (
    <div className="bg-muted rounded-md overflow-hidden shadow-sm border w-full max-w-[300px]">
      <div className="aspect-square overflow-hidden bg-black">
        {renderPreview()}
      </div>
      <div className="p-2 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-right text-white text-sm font-semibold truncate">{item.title}</h3>
          {item.type === 'url' && (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} className="text-muted-foreground" />
            </a>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-right mb-1">{item.type}</p>

        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}>
              <Trash2 size={16} />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onEdit(item)}>
              <Pencil size={16} />
            </Button>
            {onPreview && (
              <Button variant="outline" size="icon" onClick={() => onPreview(item)}>
                <Eye size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioItemCard;