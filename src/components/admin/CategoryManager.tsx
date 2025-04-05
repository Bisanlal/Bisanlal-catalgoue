
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type CategoryType = 'category' | 'type';

interface CategoryManagerProps {
  type: CategoryType;
  items: string[];
  onUpdate: () => void;
}

const CategoryManager = ({ type, items, onUpdate }: CategoryManagerProps) => {
  const [allItems, setAllItems] = useState<string[]>([]);
  const [editItem, setEditItem] = useState<{original: string; edited: string} | null>(null);
  const [newItem, setNewItem] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean; item: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setAllItems(items);
  }, [items]);

  const handleEdit = (item: string) => {
    setEditItem({ original: item, edited: item });
  };

  const handleSaveEdit = () => {
    if (!editItem || editItem.edited.trim() === '') return;
    
    try {
      // Get the current modified items from localStorage
      const storageKey = type === 'category' ? 'modifiedCategories' : 'modifiedTypes';
      const modifiedItems = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      // Update the mapping
      modifiedItems[editItem.original] = editItem.edited;
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(modifiedItems));
      
      // Update the UI
      setAllItems(prev => prev.map(item => item === editItem.original ? editItem.edited : item));
      setEditItem(null);
      
      // Trigger update in parent component
      onUpdate();
      
      // Notify user
      toast({
        description: `${type === 'category' ? 'Category' : 'Type'} updated successfully`,
      });
      
      // Update timestamp to trigger refresh across the app
      localStorage.setItem('productsUpdatedAt', Date.now().toString());
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update ${type === 'category' ? 'category' : 'type'}`
      });
    }
  };

  const handleCancelEdit = () => {
    setEditItem(null);
  };

  const handleDelete = (item: string) => {
    setDeleteDialog({ open: true, item });
  };

  const confirmDelete = () => {
    if (!deleteDialog) return;
    
    try {
      // Get the current items
      const storageKey = type === 'category' ? 'deletedCategories' : 'deletedTypes';
      const deletedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add this item to deleted list
      deletedItems.push(deleteDialog.item);
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(deletedItems));
      
      // Remove item from the UI list
      setAllItems(prev => prev.filter(item => item !== deleteDialog.item));
      
      // Close dialog
      setDeleteDialog(null);
      
      // Notify user
      toast({
        description: `${type === 'category' ? 'Category' : 'Type'} deleted successfully`,
      });
      
      // Trigger update in parent component
      onUpdate();
      
      // Update timestamp to trigger refresh across the app
      localStorage.setItem('productsUpdatedAt', Date.now().toString());
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${type === 'category' ? 'category' : 'type'}`
      });
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() === '') return;
    
    if (allItems.includes(newItem)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `This ${type === 'category' ? 'category' : 'type'} already exists`
      });
      return;
    }
    
    try {
      // Get current added items
      const storageKey = type === 'category' ? 'addedCategories' : 'addedTypes';
      const addedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add the new item
      addedItems.push(newItem);
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(addedItems));
      
      // Add the new item to the list
      setAllItems(prev => [...prev, newItem]);
      setNewItem('');
      
      // Trigger update in parent component
      onUpdate();
      
      // Notify user
      toast({
        description: `${type === 'category' ? 'Category' : 'Type'} added successfully`,
      });
      
      // Update timestamp to trigger refresh across the app
      localStorage.setItem('productsUpdatedAt', Date.now().toString());
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add ${type === 'category' ? 'category' : 'type'}`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{type === 'category' ? 'Categories' : 'Types'}</h3>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add new ${type === 'category' ? 'category' : 'type'}`}
            className="w-48"
          />
          <Button onClick={handleAddItem} size="sm">
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow">
        {allItems.length > 0 ? (
          <ul className="divide-y">
            {allItems.map((item) => (
              <li key={item} className="px-4 py-3 flex justify-between items-center">
                {editItem && editItem.original === item ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editItem.edited}
                      onChange={(e) => setEditItem({ ...editItem, edited: e.target.value })}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEdit} variant="outline" className="px-2">
                      <Check size={16} />
                    </Button>
                    <Button size="sm" onClick={handleCancelEdit} variant="outline" className="px-2">
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{item}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(item)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No {type === 'category' ? 'categories' : 'types'} found
          </div>
        )}
      </div>
      
      <Dialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this {type === 'category' ? 'category' : 'type'}?
            This may affect products using it.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
