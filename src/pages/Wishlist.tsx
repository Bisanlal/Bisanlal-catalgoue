
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, User, Plus, ChevronDown, ChevronUp, ArrowLeft, LogOut } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/products/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProductSync } from '@/hooks/use-product-sync';

const Wishlist = () => {
  const { products } = useProductSync();
  const { wishlist, removeFromWishlist, customerWishlists } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load customer names from localStorage
    const savedCustomers = localStorage.getItem('customerNames');
    
    if (savedCustomers) {
      setCustomerNames(JSON.parse(savedCustomers));
    }
    
    // Get current customer
    const current = localStorage.getItem('currentCustomer');
    if (current) {
      setCurrentCustomer(current);
      setSelectedCustomer(current);
    }
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddCustomer = () => {
    if (newCustomerName.trim() !== '' && !customerNames.includes(newCustomerName)) {
      const updatedNames = [...customerNames, newCustomerName];
      setCustomerNames(updatedNames);
      setSelectedCustomer(newCustomerName);
      setNewCustomerName('');
      
      // Save to localStorage
      localStorage.setItem('customerNames', JSON.stringify(updatedNames));
      localStorage.setItem('currentCustomer', newCustomerName);
      setCurrentCustomer(newCustomerName);
      
      toast({
        description: `Customer "${newCustomerName}" added`,
      });
    }
  };

  const handleRemoveCustomer = (name: string) => {
    setCustomerNames(customerNames.filter(n => n !== name));
    
    // Reset selected customer if needed
    if (selectedCustomer === name) {
      setSelectedCustomer('');
    }
    
    // If current customer is removed, clear it
    if (currentCustomer === name) {
      setCurrentCustomer(null);
      localStorage.removeItem('currentCustomer');
    }
    
    // Save updated names to localStorage
    localStorage.setItem('customerNames', JSON.stringify(
      customerNames.filter(n => n !== name)
    ));
    
    toast({
      description: `Customer "${name}" removed`,
    });
  };

  const handleRemoveAllForCustomer = () => {
    if (selectedCustomer) {
      // Create a copy of customerWishlists
      const updatedWishlists = { ...customerWishlists };
      // Clear customer's wishlist
      updatedWishlists[selectedCustomer] = [];
      // Save to localStorage
      localStorage.setItem('customerWishlists', JSON.stringify(updatedWishlists));
      
      toast({
        description: `All items removed from ${selectedCustomer}'s wishlist`,
      });
    }
  };

  const handleAddToCustomerWishlist = (productId: string) => {
    if (selectedCustomer) {
      // Create a copy of customerWishlists
      const updatedWishlists = { ...customerWishlists };
      updatedWishlists[selectedCustomer] = updatedWishlists[selectedCustomer] || [];
      
      if (!updatedWishlists[selectedCustomer].includes(productId)) {
        updatedWishlists[selectedCustomer] = [...updatedWishlists[selectedCustomer], productId];
        // Save to localStorage
        localStorage.setItem('customerWishlists', JSON.stringify(updatedWishlists));
        
        toast({
          description: `Item added to ${selectedCustomer}'s wishlist`,
        });
      }
    } else {
      toast({
        title: "No customer selected",
        description: "Please select or add a customer first",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromCustomerWishlist = (productId: string) => {
    if (selectedCustomer && customerWishlists[selectedCustomer]) {
      // Create a copy of customerWishlists
      const updatedWishlists = { ...customerWishlists };
      updatedWishlists[selectedCustomer] = updatedWishlists[selectedCustomer].filter(id => id !== productId);
      // Save to localStorage
      localStorage.setItem('customerWishlists', JSON.stringify(updatedWishlists));
      
      toast({
        description: `Item removed from ${selectedCustomer}'s wishlist`,
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentCustomer');
    setCurrentCustomer(null);
    
    toast({
      description: "You've been logged out",
    });
    
    navigate('/products');
  };

  const selectedWishlistItems = selectedCustomer && customerWishlists[selectedCustomer]
    ? products.filter(product => customerWishlists[selectedCustomer].includes(product.id))
    : [];
    
  const availableProducts = products.filter(product => 
    // Only include products that aren't already in the selected customer's wishlist
    selectedCustomer && 
    customerWishlists[selectedCustomer] && 
    !customerWishlists[selectedCustomer].includes(product.id)
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <main className="container py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="flex items-center text-black hover:text-gray-700 mb-4 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white p-2 rounded shadow-sm">
                <img 
                  src="/lovable-uploads/359520bd-0b84-47d6-9fdd-a94235e86480.png" 
                  alt="Bisanlal Sitaram & Sons" 
                  className="h-12"
                />
              </div>
            </div>
            <h1 className="text-3xl font-medium">Customer Wishlists</h1>
          </div>
          
          {currentCustomer && (
            <div className="flex items-center">
              <div className="bg-[#edbdb7]/10 rounded-full px-4 py-2 flex items-center mr-2">
                <User size={18} className="text-[#edbdb7] mr-2" />
                <span className="font-medium">{currentCustomer}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-500" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-medium mb-4">Customer Selection</h2>
              
              <div className="relative mb-4">
                <button
                  className="w-full p-2 border rounded-md flex items-center justify-between bg-white transition-colors hover:border-gray-400"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>{selectedCustomer || "Select Customer"}</span>
                  {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-md mt-1 z-10 max-h-48 overflow-y-auto shadow-md animate-scale-in">
                    {customerNames.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No customers added yet</div>
                    ) : (
                      customerNames.map((name) => (
                        <div
                          key={name}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between transition-colors"
                          onClick={() => {
                            setSelectedCustomer(name);
                            setShowDropdown(false);
                          }}
                        >
                          <span>{name}</span>
                          {name === selectedCustomer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCustomer(name);
                              }}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mb-4 transition-all hover:shadow-sm">
                    <Plus size={16} className="mr-2" />
                    Add New Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="customerName" className="text-sm font-medium">
                        Customer Name
                      </label>
                      <Input
                        id="customerName"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full">
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {selectedCustomer && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-2">Wishlist Stats</h3>
                  <p className="text-sm text-gray-600">
                    Items in wishlist: {selectedWishlistItems.length}
                  </p>
                  
                  {selectedWishlistItems.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAllForCustomer}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Clear Wishlist
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {selectedCustomer && (
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-medium mb-4">Add Products</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select products from the catalog to add to {selectedCustomer}'s wishlist
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center w-full p-2 bg-[#edbdb7] text-black rounded-md hover:bg-[#e9ada7] transition-all duration-300 hover:shadow-md"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-4 animate-pulse">
                    <div className="aspect-square rounded-lg skeleton"></div>
                    <div className="h-6 w-3/4 rounded skeleton"></div>
                    <div className="h-4 w-1/2 rounded skeleton"></div>
                  </div>
                ))}
              </div>
            ) : !selectedCustomer ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm animate-fade-in">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Customer Selected</h3>
                <p className="text-gray-600 mb-6">
                  Select or add a customer to view their wishlist
                </p>
              </div>
            ) : selectedWishlistItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm animate-fade-in">
                <h3 className="text-xl font-medium mb-2">{selectedCustomer}'s wishlist is empty</h3>
                <p className="text-gray-600 mb-6">
                  Browse the catalog to add products to this wishlist
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-black text-white hover:bg-[#edbdb7] hover:text-black transition-all duration-300 px-6 py-2 rounded-md hover:shadow-md"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">{selectedCustomer}'s Wishlist</h2>
                  <p className="text-gray-600">
                    {selectedWishlistItems.length} {selectedWishlistItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedWishlistItems.map(product => (
                    <div key={product.id} className="relative animate-fade-in">
                      <ProductCard product={product} />
                      <button
                        onClick={() => handleRemoveFromCustomerWishlist(product.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {selectedCustomer && availableProducts.length > 0 && (
              <div className="mt-12 animate-fade-in">
                <Separator className="my-8" />
                <h3 className="text-xl font-medium mb-6">Recommended Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProducts.map(product => (
                    <div key={product.id} className="relative">
                      <ProductCard product={product} />
                      <button
                        onClick={() => handleAddToCustomerWishlist(product.id)}
                        className="absolute top-2 right-2 bg-[#edbdb7] rounded-full p-2 shadow hover:bg-[#e9ada7] transition-colors"
                        title="Add to wishlist"
                      >
                        <Plus size={14} className="text-black" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
