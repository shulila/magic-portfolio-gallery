
import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioItem } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PortfolioItemCard } from '@/components/PortfolioItemCard';
import ItemForm from '@/components/ItemForm';

const AdminPage = () => {
  const { items, deleteItem } = usePortfolio();

  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && confirm(`האם למחוק את "${item.title || item.type}"?`)) {
      deleteItem(item.id);
    }
  };

  return (
    <main className="p-4 max-w-screen-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-center">ניהול תיק עבודות</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <PortfolioItemCard
            key={item.id}
            item={item}
            onPreview={() => setPreviewItem(item)}
            onEdit={(i) => setEditItem(i)}
            onDelete={(id) => handleDelete(id)}
            isAdmin
          />
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-4xl w-full">
          {previewItem?.type === 'image' && (
            <img src={previewItem.url} alt={previewItem.title} className="w-full rounded-lg" />
          )}
          {previewItem?.type === 'video' && (
            <video src={previewItem.url} controls className="w-full rounded-lg" />
          )}
          {previewItem?.type === 'pdf' && (
            <iframe
              src={`https://docs.google.com/gview?url=${previewItem.url}&embedded=true`}
              className="w-full h-[80vh]"
              title="PDF Preview"
            />
          )}
          {previewItem?.type === 'url' && (
            <div className="text-center">
              <p>קישור חיצוני:</p>
              <a
                href={previewItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {previewItem.url}
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-2xl w-full">
          {editItem && <ItemForm isOpen={!!editItem} onClose={() => setEditItem(null)} onSubmit={() => {}} mode="edit" initialData={editItem} />}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminPage;
