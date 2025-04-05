
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import WishlistButton from '@/components/ui/WishlistButton';
import { Video } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Toggle between product images on hover if available
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images.length > 1 && !isVideo) {
      setCurrentImageIndex(1);
    }
    
    // Auto-play video if it's a video
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play prevented:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isVideo) {
      setCurrentImageIndex(0);
    }
    
    // Pause video on mouse leave
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = () => {
    navigate(`/products/${product.id}`, { state: { transition: 'slide-up' } });
  };

  // Check if the image is actually a video URL
  const isVideo = product.images[currentImageIndex]?.endsWith('.mp4') || 
                 product.images[currentImageIndex]?.includes('video');

  const currentSource = product.images[currentImageIndex] || '';
  
  // Effect to handle video loading state
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
  }, [isVideo, currentSource]);

  return (
    <div 
      className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-1 hover:shadow-golden rounded-lg animate-fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary rounded-lg mb-4">
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
              className={`object-cover w-full h-full transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              poster="/placeholder.svg"
              muted
              playsInline
              loop
              autoPlay={isHovered}
            >
              <source src={currentSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <img 
            src={currentSource} 
            alt={product.name}
            className={`object-cover w-full h-full transition-transform duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        )}
        
        {/* Wishlist button */}
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton product={product} allowRemove={true} />
        </div>
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-gold text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {product.isBestseller && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">Bestseller</span>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      </div>
      
      <div>
        <h3 className="font-heading text-lg mb-1 transition-colors duration-500 group-hover:text-gold">
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground text-sm mb-1 font-serif">{product.category}</p>
          <div className="text-sm text-muted-foreground font-serif">
            {product.material}
            {product.purity && `, ${product.purity}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
