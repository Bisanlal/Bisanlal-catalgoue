
import { useState, useEffect } from 'react';
import { Product, products as defaultProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

/**
 * A hook that synchronizes product data across the application
 * and listens for changes made in the admin panel.
 */
export function useProductSync() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);
  const { toast } = useToast();

  // Load products initially and when updates occur
  useEffect(() => {
    loadProducts();
    
    // Set up polling for updates - increased frequency for better reactivity
    const checkForUpdates = () => {
      const updateTimestamp = localStorage.getItem('productsUpdatedAt');
      if (updateTimestamp) {
        const timestamp = parseInt(updateTimestamp);
        if (timestamp > lastUpdate) {
          loadProducts();
          setLastUpdate(timestamp);
          toast({
            description: "Product catalog updated",
          });
        }
      }
    };
    
    const interval = setInterval(checkForUpdates, 1000); // Check more frequently
    
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Function to load products with all edits applied
  const loadProducts = () => {
    setIsLoading(true);
    
    try {
      // Load custom products
      const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
      
      // Apply edits to default products
      const editedProducts = JSON.parse(localStorage.getItem('editedProducts') || '{}');
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      
      // Load category and type modifications
      const modifiedCategories = JSON.parse(localStorage.getItem('modifiedCategories') || '{}');
      const modifiedTypes = JSON.parse(localStorage.getItem('modifiedTypes') || '{}');
      const deletedCategories = JSON.parse(localStorage.getItem('deletedCategories') || '[]');
      const deletedTypes = JSON.parse(localStorage.getItem('deletedTypes') || '[]');
      const addedCategories = JSON.parse(localStorage.getItem('addedCategories') || '[]');
      const addedTypes = JSON.parse(localStorage.getItem('addedTypes') || '[]');
      
      const filteredDefaultProducts = defaultProducts
        .filter(product => !deletedProducts.includes(product.id))
        .filter(product => !deletedCategories.includes(product.category)) // Filter out products with deleted categories
        .filter(product => !deletedTypes.includes(product.type)) // Filter out products with deleted types
        .map(product => {
          let finalProduct = { ...product };
          
          // Apply edits if this product has been edited
          if (editedProducts[product.id]) {
            finalProduct = editedProducts[product.id];
          }
          
          // Apply category changes if applicable
          if (modifiedCategories[finalProduct.category]) {
            finalProduct.category = modifiedCategories[finalProduct.category];
          }
          
          // Apply type changes if applicable
          if (modifiedTypes[finalProduct.type]) {
            finalProduct.type = modifiedTypes[finalProduct.type];
          }
          
          return finalProduct;
        });
      
      // Also apply category/type changes to custom products
      const updatedCustomProducts = customProducts
        .filter(product => !deletedCategories.includes(product.category)) // Filter out products with deleted categories
        .filter(product => !deletedTypes.includes(product.type)) // Filter out products with deleted types
        .map(product => {
          let updatedProduct = { ...product };
          
          if (modifiedCategories[updatedProduct.category]) {
            updatedProduct.category = modifiedCategories[updatedProduct.category];
          }
          
          if (modifiedTypes[updatedProduct.type]) {
            updatedProduct.type = modifiedTypes[updatedProduct.type];
          }
          
          return updatedProduct;
        });
      
      const combinedProducts = [...filteredDefaultProducts, ...updatedCustomProducts];
      setProducts(combinedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Force a refresh of product data
  const refreshProducts = () => {
    const timestamp = Date.now();
    localStorage.setItem('productsUpdatedAt', timestamp.toString());
    setLastUpdate(timestamp);
  };

  return {
    products,
    isLoading,
    refreshProducts
  };
}
