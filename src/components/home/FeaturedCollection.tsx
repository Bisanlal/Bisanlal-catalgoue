
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/data/products';
import WishlistButton from '@/components/ui/WishlistButton';

interface FeaturedCollectionProps {
  title: string;
  description?: string;
  products: Product[];
  viewAllLink?: string;
}

const FeaturedCollection = ({ 
  title, 
  description, 
  products, 
  viewAllLink = "/products" 
}: FeaturedCollectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary rounded-lg mb-4 image-hover-zoom">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Quick actions overlay */}
                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300`}>
                  <Link 
                    to={`/products/${product.id}`}
                    className="bg-white text-black hover:bg-gold hover:text-white premium-transition px-4 py-2 rounded"
                  >
                    Quick View
                  </Link>
                </div>
                
                {/* Wishlist button */}
                <div className="absolute top-3 right-3 z-10">
                  <WishlistButton product={product} />
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
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-1 transition-colors duration-300 group-hover:text-gold">
                  <Link to={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                <p className="font-semibold">${product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {viewAllLink && (
          <div className="text-center mt-12">
            <Link 
              to={viewAllLink}
              className="inline-flex items-center text-foreground hover:text-gold premium-transition"
            >
              <span>View All Collection</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;
