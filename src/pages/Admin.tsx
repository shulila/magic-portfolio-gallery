import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ItemForm from '@/components/ItemForm';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { PortfolioItem } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Admin = () => {
  const { items, addItem, updateItem, deleteItem, isLoading } = usePortfolio();
  const { authState } = useAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PortfolioItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  
  // Redirect if not authenticated
  if (!authState.isAuthenticated && !authState.isLoading) {
    return <Navigate to="/login" />;
  }

  if (authState.isLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleEditItem = (item: PortfolioItem) => {
    setItemToEdit(item);
  };

  const handleDeleteItem = (item: PortfolioItem) => {
    setItemToDelete(item);
  };

  const handlePreviewItem = (item: PortfolioItem) => {
    setPreviewItem(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const renderPreviewContent = () => {
    if (!previewItem) return null;

    switch (previewItem.type) {
      case 'image':
        return (
          <AspectRatio ratio={16/9}>
            <img 
              src={previewItem.url} 
              alt={previewItem.title} 
              className="w-full h-full object-contain rounded-md" 
            />
          </AspectRatio>
        );
      case 'video':
        return (
          <AspectRatio ratio={16/9}>
            <iframe 
              src={previewItem.url.includes('youtube') ? 
                previewItem.url.replace('watch?v=', 'embed/') : previewItem.url} 
              title={previewItem.title}
              className="w-full h-full rounded-md" 
              allowFullScreen
            ></iframe>
          </AspectRatio>
        );
      case 'url':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-secondary/30 p-8 rounded-full mb-4">
              <AspectRatio ratio={16/9}>
                {previewItem.thumbnailUrl ? (
                  <img 
                    src={previewItem.thumbnailUrl} 
                    alt={previewItem.title} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/30 rounded-md">
                    <h3 className="text-xl font-medium">External URL Preview</h3>
                  </div>
                )}
              </AspectRatio>
            </div>
            <Button asChild className="mt-4">
              <a 
                href={previewItem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Open External Site
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
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add New Item
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium mb-2">Gallery is Empty</h2>
          <p className="text-muted-foreground mb-6">There are no items in your gallery yet</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add First Item
          </Button>
        </div>
      ) : (
        <div className="gallery-grid">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <PortfolioItemCard 
                item={item} 
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onView={handlePreviewItem}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Add Item Dialog */}
      <ItemForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addItem}
        mode="add"
      />
      
      {/* Edit Item Dialog */}
      {itemToEdit && (
        <ItemForm
          isOpen={!!itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSubmit={(updatedItem) => {
            updateItem(itemToEdit.id, updatedItem);
            setItemToEdit(null);
          }}
          initialData={itemToEdit}
          mode="edit"
        />
      )}
      
      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="sm:max-w-[800px]">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle>{previewItem.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {renderPreviewContent()}
                {previewItem.description && (
                  <p className="mt-4 text-muted-foreground">{previewItem.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete "{itemToDelete?.title}" from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
