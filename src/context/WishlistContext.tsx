import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  customerWishlists: Record<string, string[]>;
  addToCustomerWishlist: (customerName: string, productId: string) => void;
  removeFromCustomerWishlist: (customerName: string, productId: string) => void;
  isInCustomerWishlist: (customerName: string, productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useLocalStorage hook for persistent state
  const [wishlist, setWishlist] = useLocalStorage<Product[]>("wishlist", []);
  const [customerWishlists, setCustomerWishlists] = useLocalStorage<Record<string, string[]>>("customerWishlists", {});

  // Load and save customer names
  useEffect(() => {
    // Extract customer names from wishlists and save to localStorage
    const customerNames = Object.keys(customerWishlists);
    try {
      localStorage.setItem("customerNames", JSON.stringify(customerNames));
    } catch (error) {
      console.warn("Error saving customer names to localStorage:", error);
    }
  }, [customerWishlists]);

  const addToWishlist = (product: Product) => {
    // Optimize storage by only storing essential product data
    const essentialProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images.slice(0, 1), // Only store first image URL
      // Add other essential fields as needed
      type: product.type,
      material: product.material,
      purity: product.purity,
      gemstone: product.gemstone,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
      isTrending: product.isTrending,
    };

    setWishlist((prev) => {
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, essentialProduct as Product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter(item => item.id !== productId));
    
    // Also remove this product from all customer wishlists
    const updatedCustomerWishlists = { ...customerWishlists };
    Object.keys(updatedCustomerWishlists).forEach(customerName => {
      updatedCustomerWishlists[customerName] = updatedCustomerWishlists[customerName].filter(id => id !== productId);
    });
    setCustomerWishlists(updatedCustomerWishlists);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const addToCustomerWishlist = (customerName: string, productId: string) => {
    // If this is a new customer, add to customer names list
    setCustomerWishlists((prev) => {
      const customerList = prev[customerName] || [];
      if (!customerList.includes(productId)) {
        return {
          ...prev,
          [customerName]: [...customerList, productId]
        };
      }
      return prev;
    });
  };

  const removeFromCustomerWishlist = (customerName: string, productId: string) => {
    setCustomerWishlists((prev) => {
      const customerList = prev[customerName] || [];
      return {
        ...prev,
        [customerName]: customerList.filter(id => id !== productId)
      };
    });
  };

  const isInCustomerWishlist = (customerName: string, productId: string) => {
    return (customerWishlists[customerName] || []).includes(productId);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        customerWishlists,
        addToCustomerWishlist,
        removeFromCustomerWishlist,
        isInCustomerWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
