
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Search, Menu, X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jewellery", path: "/products" },
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-black-soft/80 backdrop-blur-lg shadow-sm" 
          : "bg-white"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="bg-white p-1 rounded">
            <img 
              src="/lovable-uploads/359520bd-0b84-47d6-9fdd-a94235e86480.png" 
              alt="Bisanlal Sitaram & Sons"
              className="h-12"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm uppercase tracking-wider premium-transition hover:text-[#edbdb7] ${
                location.pathname === link.path 
                  ? "text-[#edbdb7] font-medium" 
                  : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            aria-label="Search"
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
          >
            <Search size={20} />
          </button>
          
          <Link 
            to="/wishlist"
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200 relative"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#edbdb7] text-black text-xs flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <button 
            aria-label="Cart"
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
          >
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white dark:bg-black-soft z-50 pt-20 px-6 md:hidden animate-scale-in">
            <nav className="flex flex-col space-y-8 mt-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-xl uppercase tracking-wider premium-transition ${
                    location.pathname === link.path 
                      ? "text-[#edbdb7] font-medium" 
                      : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex items-center space-x-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Link 
                  to="/search"
                  className="flex items-center space-x-2"
                  aria-label="Search"
                >
                  <Search size={20} />
                  <span>Search</span>
                </Link>
                
                <Link 
                  to="/wishlist"
                  className="flex items-center space-x-2 relative"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#edbdb7] text-black text-xs flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/cart"
                  className="flex items-center space-x-2"
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} />
                  <span>Cart</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
