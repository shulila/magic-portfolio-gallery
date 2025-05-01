
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
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Admin = () => {
  const { items, addItem, updateItem, deleteItem, isLoading } = usePortfolio();
  const { authState } = useAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PortfolioItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  
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

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
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
              <PortfolioItemCard item={item} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  onClick={() => handleEditItem(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  onClick={() => handleDeleteItem(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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
