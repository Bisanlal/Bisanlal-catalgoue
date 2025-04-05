
import { useState, useEffect, useRef } from 'react';
import { Share2, ChevronRight, ChevronLeft, Video } from 'lucide-react';
import { Product } from '@/data/products';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductMagnifier from './ProductMagnifier';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const { addToCustomerWishlist, customerWishlists } = useWishlist();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerNames, setCustomerNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('customerNames');
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Load current customer
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      setCurrentCustomer(savedCustomer);
    }
  }, []);
  
  // Check if the current image is a video
  const isVideo = product.images[currentImageIndex]?.endsWith('.mp4') || 
                 product.images[currentImageIndex]?.includes('video');

  // Reset video loading state when source changes
  useEffect(() => {
    setIsVideoLoaded(false);
    if (isVideo && videoRef.current) {
      const handleLoaded = () => setIsVideoLoaded(true);
      videoRef.current.addEventListener('loadeddata', handleLoaded);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoaded);
        }
      };
    }
  }, [isVideo, currentImageIndex]);

  const handlePrevImage = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setIsVideoPlaying(false);
    
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 150);
  };

  const handleNextImage = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setIsVideoPlaying(false);
    
    setTimeout(() => {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 150);
  };

  const handleAddCustomer = () => {
    if (customerName.trim() !== '' && !customerNames.includes(customerName)) {
      const updatedNames = [...customerNames, customerName];
      setCustomerNames(updatedNames);
      localStorage.setItem('customerNames', JSON.stringify(updatedNames));
      
      // Set as current customer
      localStorage.setItem('currentCustomer', customerName);
      setCurrentCustomer(customerName);
      
      // Add product to this customer's wishlist
      addToCustomerWishlist(customerName, product.id);
      
      setCustomerName('');
      
      toast({
        description: `Product added to ${customerName}'s wishlist`,
      });
      setDialogOpen(false);
    }
  };

  const handleWishlistToggle = (selectedCustomer?: string) => {
    if (selectedCustomer) {
      // Add to specific customer's wishlist
      addToCustomerWishlist(selectedCustomer, product.id);
      
      // Set as current customer if not already set
      if (!currentCustomer) {
        localStorage.setItem('currentCustomer', selectedCustomer);
        setCurrentCustomer(selectedCustomer);
      }
      
      toast({
        description: `Added to ${selectedCustomer}'s wishlist`,
      });
      
      // Close the dialog after adding to wishlist
      setDialogOpen(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleThumbnailClick = (index: number) => {
    if (transitioning || index === currentImageIndex) return;
    
    setTransitioning(true);
    setIsVideoPlaying(false);
    
    setTimeout(() => {
      setCurrentImageIndex(index);
      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 150);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="lg:w-1/2 space-y-4">
          <div className="relative aspect-square overflow-hidden bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-500 group">
            {isVideo ? (
              <div className="w-full h-full relative">
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <Video className="text-gray-400" size={32} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
                  <div className="bg-black/50 p-2 rounded-full">
                    <Video className="text-white" size={24} />
                  </div>
                </div>
                <video 
                  ref={videoRef}
                  className={`object-cover w-full h-full transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  poster="/placeholder.svg"
                  muted
                  playsInline
                  loop
                  autoPlay={isVideoPlaying}
                  onPlay={() => setIsVideoPlaying(true)}
                >
                  <source src={product.images[currentImageIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <ProductMagnifier 
                imageUrl={product.images[currentImageIndex]} 
                alt={product.name} 
              />
            )}
            
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white hover:shadow-golden transition-all duration-500 transform hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white hover:shadow-golden transition-all duration-500 transform hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Tags */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-gold text-white text-xs px-2 py-1 rounded">New</span>
              )}
              {product.isBestseller && (
                <span className="bg-black text-white text-xs px-2 py-1 rounded">Bestseller</span>
              )}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => {
                const isVideoThumb = image?.endsWith('.mp4') || image?.includes('video');
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (transitioning || index === currentImageIndex) return;
                      setTransitioning(true);
                      setIsVideoPlaying(false);
                      setTimeout(() => {
                        setCurrentImageIndex(index);
                        setTimeout(() => {
                          setTransitioning(false);
                        }, 300);
                      }, 150);
                    }}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 relative transition-all duration-500 ${
                      index === currentImageIndex ? 'border-gold shadow-golden' : 'border-transparent hover:border-gold/50'
                    }`}
                  >
                    {isVideoThumb ? (
                      <div className="relative w-full h-full">
                        <img 
                          src="/placeholder.svg" 
                          alt="Video thumbnail"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-black/50 p-2 rounded-full">
                            <Video className="text-white" size={18} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-heading font-medium mb-4">{product.name}</h1>
          
          {product.description && (
            <p className="text-muted-foreground mb-8 font-serif">
              {product.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p>{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p>{product.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Material</p>
              <p>{product.material}{product.purity && `, ${product.purity}`}</p>
            </div>
            {product.gemstone && (
              <div>
                <p className="text-sm text-muted-foreground">Gemstone</p>
                <p>{product.gemstone}</p>
              </div>
            )}
            {product.goldWeight && (
              <div>
                <p className="text-sm text-muted-foreground">Gold Weight</p>
                <p>{product.goldWeight}g</p>
              </div>
            )}
            {product.diamondCts && (
              <div>
                <p className="text-sm text-muted-foreground">Diamond Weight</p>
                <p>{product.diamondCts}cts</p>
              </div>
            )}
            {product.occasion && (
              <div>
                <p className="text-sm text-muted-foreground">Occasion</p>
                <p>{product.occasion}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p>{product.gender}</p>
            </div>
          </div>
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-[#edbdb7]/10 text-black px-3 py-1 rounded-full text-sm transition-colors hover:bg-[#edbdb7]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Add to Wishlist button for customer */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 bg-gold hover:bg-gold-dark text-white transition-all duration-500 py-3 rounded-lg flex items-center justify-center hover:shadow-golden transform hover:-translate-y-1">
                  Add to Customer Wishlist
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Customer Wishlist</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {customerNames.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium mb-2">Select Customer:</p>
                      <div className="space-y-2">
                        {customerNames.map((name) => (
                          <button
                            key={name}
                            onClick={() => handleWishlistToggle(name)}
                            className="w-full text-left p-2 rounded hover:bg-gray-100 flex justify-between items-center transition-colors"
                          >
                            <span>{name}</span>
                            <span className="text-xs bg-[#edbdb7] text-black px-2 py-1 rounded-full">
                              {(customerWishlists[name] || []).includes(product.id) ? 'Added' : 'Add'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Add New Customer:</p>
                    <div className="flex gap-2">
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className="flex-1"
                      />
                      <Button onClick={handleAddCustomer} className="bg-[#edbdb7] hover:bg-[#e9ada7] text-black">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors duration-500"
          >
            <Share2 size={16} />
            <span>Share this product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
