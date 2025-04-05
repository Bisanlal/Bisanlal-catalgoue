import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    // Prevent build error on server
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to local state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        // Optimize storage by compressing data when possible
        let dataToStore: string;
        
        if (Array.isArray(valueToStore)) {
          // For arrays (like products), we can optimize storage by keeping only essential data
          const optimizedArray = valueToStore.map((item: any) => {
            // If this is likely a product item with images, optimize it further
            if (item && typeof item === 'object' && item.images && Array.isArray(item.images)) {
              // Keep only one image URL per product to save space
              return {
                ...item,
                images: item.images.slice(0, 1),
                description: item.description?.substring(0, 100) // Truncate long descriptions
              };
            }
            return item;
          });
          dataToStore = JSON.stringify(optimizedArray);
        } else if (typeof valueToStore === 'object' && valueToStore !== null) {
          // For other objects, just stringify normally
          dataToStore = JSON.stringify(valueToStore);
        } else {
          dataToStore = JSON.stringify(valueToStore);
        }
        
        try {
          window.localStorage.setItem(key, dataToStore);
        } catch (storageError: any) {
          console.error(`Error setting localStorage key "${key}" - likely quota exceeded:`, storageError);
          
          // Clear some old data if possible
          if (storageError.name === 'QuotaExceededError' || 
              // Safari
              storageError.name === 'QUOTA_EXCEEDED_ERR') {
            
            let clearSuccess = false;
            
            // Try to remove oldest items first if this is a product-related key
            if (key.includes('product')) {
              const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
              if (customProducts.length > 10) {
                // Keep only the 10 most recent products
                const newProducts = customProducts.slice(-10);
                localStorage.setItem('customProducts', JSON.stringify(newProducts));
                console.log('Cleared older products to make space');
                clearSuccess = true;
              }
            }
            
            // Try clearing temporary data if exists
            try {
              const tempKeys = ['tempUploadData', 'tempImportData', 'draftProducts'];
              tempKeys.forEach(tempKey => {
                if (localStorage.getItem(tempKey)) {
                  localStorage.removeItem(tempKey);
                  clearSuccess = true;
                }
              });
            } catch (e) {
              // Ignore errors in cleanup
            }
            
            // Try again if we cleared some space
            if (clearSuccess) {
              try {
                window.localStorage.setItem(key, dataToStore);
                console.log('Successfully saved data after clearing space');
              } catch (e) {
                console.error('Still unable to save data after cleanup attempts');
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage key in other windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    // This only works for other windows, not the current window
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
