
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductMagnifierProps {
  imageUrl: string;
  alt: string;
  isVideo?: boolean;
}

const ProductMagnifier = ({ imageUrl, alt, isVideo = false }: ProductMagnifierProps) => {
  const [magnified, setMagnified] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !magnified) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !magnified || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  const toggleMagnify = () => {
    setMagnified(!magnified);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  // Reset magnification when component unmounts or changes
  useEffect(() => {
    return () => {
      setMagnified(false);
      setZoomLevel(1.5);
    };
  }, [imageUrl]);

  // Don't render for videos
  if (isVideo) {
    return null;
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className={`relative overflow-hidden aspect-square rounded-lg ${magnified ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={toggleMagnify}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <img 
          src={imageUrl} 
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${magnified ? 'opacity-0' : 'opacity-100'}`}
        />

        {magnified && (
          <div 
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-white/70 dark:bg-black/70 p-1 rounded-lg backdrop-blur-md z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={zoomIn}
          disabled={!magnified || zoomLevel >= 3}
          className="h-8 w-8 rounded-full transition-all hover:bg-[#eca6a7]/10 hover:text-[#eca6a7]"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={zoomOut}
          disabled={!magnified || zoomLevel <= 1}
          className="h-8 w-8 rounded-full transition-all hover:bg-[#eca6a7]/10 hover:text-[#eca6a7]"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
      </div>

      {/* Instruction tooltip */}
      {!isMobile && !magnified && (
        <div className="absolute top-4 left-4 bg-white/70 dark:bg-black/70 px-3 py-1 rounded-lg text-xs backdrop-blur-md text-black/70 dark:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          Click to magnify
        </div>
      )}
    </div>
  );
};

export default ProductMagnifier;
