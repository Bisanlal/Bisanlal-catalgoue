
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { Grid, List, Filter, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } // Slightly faster transition
  }
};

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  currentCustomer?: string | null;
  curatedProducts?: Product[];
  isCuratedView?: boolean;
  onToggleCuratedView?: () => void;
}

const ProductGrid = ({ 
  products, 
  isLoading = false, 
  currentCustomer = null,
  curatedProducts = [],
  isCuratedView = false,
  onToggleCuratedView
}: ProductGridProps) => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<string[]>([]);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customerNames');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    
    if (currentCustomer) {
      setSelectedCustomer(currentCustomer);
    }
  }, [currentCustomer]);

  // Update products based on curated view
  useEffect(() => {
    if (isCuratedView && curatedProducts.length > 0) {
      setFilteredProducts(curatedProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [products, curatedProducts, isCuratedView]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-4 animate-pulse">
            <div className="aspect-square rounded-lg skeleton"></div>
            <div className="h-6 w-3/4 rounded skeleton"></div>
            <div className="h-4 w-1/2 rounded skeleton"></div>
            <div className="h-5 w-1/4 rounded skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <h3 className="text-2xl font-medium mb-4">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
    >
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
          </p>
          
          {isCuratedView && currentCustomer && (
            <div className="bg-[#edbdb7]/10 px-4 py-1 rounded-lg border border-[#edbdb7]/20">
              <span className="text-sm font-medium">Curated for {currentCustomer}</span>
            </div>
          )}
          
          {currentCustomer && onToggleCuratedView && (
            <Button
              variant={isCuratedView ? "default" : "outline"}
              size="sm"
              onClick={onToggleCuratedView}
              className={isCuratedView ? "bg-[#edbdb7] hover:bg-[#e9ada7] text-black" : ""}
            >
              {isCuratedView ? "View All Products" : `Curated for ${currentCustomer}`}
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-md transition-colors ${viewType === 'grid' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            aria-label="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md transition-colors ${viewType === 'list' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isCuratedView && currentCustomer && (
        <motion.div 
          className="bg-[#edbdb7]/10 p-4 rounded-lg border border-[#edbdb7]/20 mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg">Curated for {currentCustomer}</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations based on your style preferences and wishlist history
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleCuratedView}
            >
              View All Products
            </Button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {viewType === 'grid' ? (
          <motion.div 
            key="grid-view"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeVariants}
          >
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list-view"
            className="space-y-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeVariants}
          >
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col md:flex-row gap-6 border-b pb-8 transition-all duration-300 hover:bg-gray-50 p-4 rounded-lg"
              >
                <div className="w-full md:w-1/3 aspect-square">
                  <ProductCard product={product} />
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p>{product.category}</p>
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
                    {product.occasion && (
                      <div>
                        <p className="text-sm text-muted-foreground">Occasion</p>
                        <p>{product.occasion}</p>
                      </div>
                    )}
                  </div>
                  {product.goldWeight && (
                    <div className="mb-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                        Gold: {product.goldWeight}g
                      </span>
                    </div>
                  )}
                  {product.diamondCts && (
                    <div>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        Diamond: {product.diamondCts}cts
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
