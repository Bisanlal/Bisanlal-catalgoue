
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ProductDetailComponent from '@/components/products/ProductDetail';
import { Product } from '@/data/products';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { useProductSync } from '@/hooks/use-product-sync';
import { useToast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductSync();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Load current customer
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      setCurrentCustomer(savedCustomer);
    }
    
    // Simulate loading
    setIsLoading(true);
    
    setTimeout(() => {
      // Find the product
      const foundProduct = products.find(p => p.id === id) || null;
      setProduct(foundProduct);
      
      // Find related products (same category)
      if (foundProduct) {
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
      
      // Scroll to top
      window.scrollTo(0, 0);
    }, 600);
  }, [id, products]);
  
  const handleLogout = () => {
    localStorage.removeItem('currentCustomer');
    setCurrentCustomer(null);
    
    toast({
      description: "You've been logged out",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 animate-fade-in">
        <div className="max-w-screen-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 w-20 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg bg-gray-200"></div>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-24 h-24 bg-gray-200 rounded-md"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-4 md:p-8 animate-fade-in">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h1 className="text-3xl font-medium mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, the product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-black text-white hover:bg-[#edbdb7] hover:text-black transition-all duration-300 px-6 py-2 rounded-md hover:shadow-md"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/products" className="flex items-center text-black hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Products
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded shadow-sm">
                <img 
                  src="/lovable-uploads/359520bd-0b84-47d6-9fdd-a94235e86480.png" 
                  alt="Bisanlal Sitaram & Sons" 
                  className="h-12"
                />
              </div>
              <h2 className="text-xl font-medium">Product Details</h2>
            </div>
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
        
        <ProductDetailComponent product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
