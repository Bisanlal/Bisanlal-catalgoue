import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WishlistButtonProps {
  product: Product;
  size?: number;
  className?: string;
  allowRemove?: boolean;
}

const WishlistButton = ({ product, size = 20, className = "", allowRemove = false }: WishlistButtonProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, addToCustomerWishlist, removeFromCustomerWishlist, isInCustomerWishlist, customerWishlists } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const { toast } = useToast();
  
  const isActive = isInWishlist(product.id);

  useEffect(() => {
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      setCurrentCustomer(savedCustomer);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (currentCustomer && allowRemove) {
      if (isInCustomerWishlist(currentCustomer, product.id)) {
        removeFromCustomerWishlist(currentCustomer, product.id);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        toast({
          description: `Removed from ${currentCustomer}'s wishlist`,
        });
        return;
      }
      
      addToCustomerWishlist(currentCustomer, product.id);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      toast({
        description: `Added to ${currentCustomer}'s wishlist`,
      });
      return;
    }
    
    setDialogOpen(true);
    
    if (!isActive) {
      addToWishlist(product);
    }
  };

  const handleAddToCustomerWishlist = () => {
    if (selectedCustomer) {
      addToCustomerWishlist(selectedCustomer, product.id);
      
      if (!currentCustomer) {
        localStorage.setItem('currentCustomer', selectedCustomer);
        setCurrentCustomer(selectedCustomer);
      }
      
      toast({
        description: `${product.name} added to ${selectedCustomer}'s wishlist`,
      });
      setDialogOpen(false);
    } else if (newCustomerName.trim()) {
      const existingNames = JSON.parse(localStorage.getItem('customerNames') || '[]');
      
      if (!existingNames.includes(newCustomerName)) {
        const updatedNames = [...existingNames, newCustomerName];
        localStorage.setItem('customerNames', JSON.stringify(updatedNames));
      }
      
      addToCustomerWishlist(newCustomerName, product.id);
      
      localStorage.setItem('currentCustomer', newCustomerName);
      setCurrentCustomer(newCustomerName);
      
      toast({
        description: `${product.name} added to ${newCustomerName}'s wishlist`,
      });
      setDialogOpen(false);
      setNewCustomerName("");
    } else {
      toast({
        title: "No customer selected",
        description: "Please select or add a customer",
        variant: "destructive"
      });
    }
  };

  const customerNames = localStorage.getItem('customerNames') 
    ? JSON.parse(localStorage.getItem('customerNames') || '[]') 
    : [];

  const isInCurrentCustomerWishlist = currentCustomer 
    ? isInCustomerWishlist(currentCustomer, product.id)
    : false;

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={isInCurrentCustomerWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        className={`p-2 rounded-full transition-all duration-300 ${
          isInCurrentCustomerWishlist 
            ? "bg-[#edbdb7]/10 text-[#edbdb7]" 
            : "bg-secondary hover:bg-secondary/80"
        } ${isAnimating ? "scale-125" : "scale-100"} ${className}`}
      >
        <Heart 
          size={size} 
          className={isInCurrentCustomerWishlist ? "fill-[#edbdb7]" : ""} 
        />
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Customer Wishlist</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {customerNames.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Customer</h3>
                <div className="flex flex-wrap gap-2">
                  {customerNames.map((name: string) => (
                    <button
                      key={name}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedCustomer === name 
                          ? "bg-[#edbdb7] text-black" 
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedCustomer(name)}
                    >
                      {name}
                      {customerWishlists[name] && customerWishlists[name].includes(product.id) && 
                        <span className="ml-1">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Or Add New Customer</h3>
              <Input
                placeholder="Enter customer name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddToCustomerWishlist}>
              Add to Wishlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WishlistButton;
