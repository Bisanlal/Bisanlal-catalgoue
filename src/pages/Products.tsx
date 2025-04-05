import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import FilterSidebar, { FilterState } from '@/components/products/FilterSidebar';
import ProductGrid from '@/components/products/ProductGrid';
import { products as defaultProducts, Product } from '@/data/products';
import { ChevronDown, SlidersHorizontal, X, ArrowLeft, Heart, User, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProductSync } from '@/hooks/use-product-sync';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/context/WishlistContext';
import { RecommendationEngine } from '@/utils/recommendationEngine';

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  const [isCuratedView, setIsCuratedView] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    goldWeightRange: [0, 50],
    diamondCtsRange: [0, 10],
    categories: [],
    types: [],
    materials: [],
    purities: [],
    gemstones: [],
    occasions: [],
    genders: [],
    tags: [],
    sort: "featured"
  });
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { products: allProducts } = useProductSync();
  const { toast } = useToast();
  const { customerWishlists } = useWishlist();

  // Check for customer on load
  useEffect(() => {
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      setCurrentCustomer(savedCustomer);
    } else {
      // Show customer dialog if no customer is set
      setCustomerDialogOpen(true);
    }
  }, []);
  
  // Generate AI recommendations when customer or wishlists change
  useEffect(() => {
    if (currentCustomer && customerWishlists) {
      // Create recommendation engine
      const engine = new RecommendationEngine(customerWishlists, allProducts);
      
      // Get personalized recommendations
      const recommendations = engine.getHybridRecommendations(currentCustomer);
      setCuratedProducts(recommendations);
      
      // Check if URL has curated parameter
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('curated') === 'true') {
        setIsCuratedView(true);
      }
    }
  }, [currentCustomer, customerWishlists, allProducts, location.search]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.search]);

  useEffect(() => {
    let result = [...allProducts];
    
    result = result.filter(product => {
      if (!product.goldWeight) return true;
      const weight = parseFloat(product.goldWeight);
      return weight >= filters.goldWeightRange[0] && weight <= filters.goldWeightRange[1];
    });
    
    result = result.filter(product => {
      if (!product.diamondCts) return true;
      const carats = parseFloat(product.diamondCts);
      return carats >= filters.diamondCtsRange[0] && carats <= filters.diamondCtsRange[1];
    });
    
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    if (filters.types.length > 0) {
      result = result.filter(product => 
        filters.types.includes(product.type)
      );
    }
    
    if (filters.materials.length > 0) {
      result = result.filter(product => 
        filters.materials.includes(product.material)
      );
    }
    
    if (filters.purities.length > 0) {
      result = result.filter(product => 
        product.purity && filters.purities.includes(product.purity)
      );
    }
    
    if (filters.gemstones.length > 0) {
      result = result.filter(product => 
        product.gemstone && filters.gemstones.includes(product.gemstone)
      );
    }
    
    if (filters.occasions.length > 0) {
      result = result.filter(product => 
        product.occasion && filters.occasions.some(occasion => 
          product.occasion?.includes(occasion)
        )
      );
    }
    
    if (filters.genders.length > 0) {
      result = result.filter(product => 
        filters.genders.includes(product.gender)
      );
    }
    
    if (filters.tags.length > 0) {
      result = result.filter(product => 
        product.tags && filters.tags.some(tag => product.tags?.includes(tag))
      );
    }
    
    if (sortOption === "new") {
      result = result.filter(product => product.isNew);
    } else if (sortOption === "bestsellers") {
      result = result.filter(product => product.isBestseller);
    } else if (sortOption === "trending") {
      result = result.filter(product => product.isTrending);
    }
    
    setFilteredProducts(result);
    
    // Also apply filters to curated products if in curated view
    if (isCuratedView && currentCustomer) {
      const engine = new RecommendationEngine(customerWishlists, result);
      const filteredRecommendations = engine.getHybridRecommendations(currentCustomer);
      setCuratedProducts(filteredRecommendations);
    }
  }, [filters, sortOption, allProducts, isCuratedView, currentCustomer, customerWishlists]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    
    const params = new URLSearchParams(location.search);
    if (sort !== "featured") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    
    // Keep curated parameter if it exists
    if (isCuratedView) {
      params.set("curated", "true");
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  const handleToggleCuratedView = () => {
    const newCuratedState = !isCuratedView;
    setIsCuratedView(newCuratedState);
    
    // Update URL to reflect curated state
    const params = new URLSearchParams(location.search);
    if (newCuratedState) {
      params.set("curated", "true");
      
      // Show toast notification for curated view
      toast({
        title: `Curated for ${currentCustomer}`,
        description: "Showing personalized recommendations based on your preferences",
      });
    } else {
      params.delete("curated");
      
      // Show toast notification for standard view
      toast({
        description: "Showing all products",
      });
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  const handleSetCustomer = () => {
    if (newCustomerName.trim()) {
      // Get existing customer names
      const existingNames = JSON.parse(localStorage.getItem('customerNames') || '[]');
      
      // Add new customer to the list if it doesn't exist
      if (!existingNames.includes(newCustomerName)) {
        const updatedNames = [...existingNames, newCustomerName];
        localStorage.setItem('customerNames', JSON.stringify(updatedNames));
      }
      
      // Set as current customer
      localStorage.setItem('currentCustomer', newCustomerName);
      setCurrentCustomer(newCustomerName);
      
      toast({
        description: `Welcome, ${newCustomerName}!`,
      });
      
      setCustomerDialogOpen(false);
      setNewCustomerName("");
    } else {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentCustomer');
    setCurrentCustomer(null);
    setCustomerDialogOpen(true);
    setIsCuratedView(false);
    
    // Remove curated parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete("curated");
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    toast({
      description: "You've been logged out",
    });
  };

  const getCustomerNames = () => {
    const savedNames = localStorage.getItem('customerNames');
    return savedNames ? JSON.parse(savedNames) : [];
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 animate-fade-in">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/" className="flex items-center text-black hover:text-gray-700 mb-4 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded shadow-sm">
                <img 
                  src="/lovable-uploads/359520bd-0b84-47d6-9fdd-a94235e86480.png" 
                  alt="Bisanlal Sitaram & Sons" 
                  className="h-12"
                />
              </div>
            </div>
            <h2 className="text-xl font-medium mt-2">Product Catalogue</h2>
          </div>
          <div className="flex items-center gap-4">
            {currentCustomer ? (
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
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCustomerDialogOpen(true)}
              >
                <User size={18} className="mr-2" />
                Log In
              </Button>
            )}
            <Link to="/wishlist" className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Heart size={24} className="text-[#edbdb7]" />
              <span className="hidden md:inline">Customer Wishlists</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          )}

          <div className="relative ml-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-transparent border rounded-md px-3 py-1 pr-8 text-sm transition-colors hover:border-gray-400"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New Arrivals</option>
                  <option value="bestsellers">Bestsellers</option>
                  <option value="trending">Trending</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {!isMobile && (
            <div className="lg:col-span-1">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          )}
          
          {isMobile && showFilters && (
            <div className="fixed inset-0 z-50 bg-white p-6 pt-20 overflow-auto animate-fade-in">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-6 right-6 p-2"
              >
                <X size={24} />
              </button>
              <FilterSidebar onFilterChange={handleFilterChange} />
              <div className="sticky bottom-0 pt-4 pb-6 bg-white">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-black text-white rounded-lg transition-colors hover:bg-gray-800"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          <div className="lg:col-span-3">
            <ProductGrid 
              products={filteredProducts} 
              isLoading={isLoading} 
              currentCustomer={currentCustomer}
              curatedProducts={curatedProducts}
              isCuratedView={isCuratedView}
              onToggleCuratedView={handleToggleCuratedView}
            />
          </div>
        </div>
      </div>

      {/* Customer Login Dialog */}
      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Bisanlal Sitaram & Sons</DialogTitle>
            <DialogDescription>
              Please enter your name to create a personalized shopping experience with AI-powered recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <Input
                placeholder="Enter your name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
              
              {getCustomerNames().length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Or select from previous customers:</p>
                  <div className="flex flex-wrap gap-2">
                    {getCustomerNames().map((name: string) => (
                      <button
                        key={name}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          localStorage.setItem('currentCustomer', name);
                          setCurrentCustomer(name);
                          setCustomerDialogOpen(false);
                          toast({
                            description: `Welcome back, ${name}!`,
                          });
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleSetCustomer}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
