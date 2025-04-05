
import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import Navbar from "@/components/layout/Navbar";
import { products } from "@/data/products";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter products for different collections
  const newArrivals = products.filter(product => product.isNew);
  const bestsellers = products.filter(product => product.isBestseller);
  const trending = products.filter(product => product.isTrending);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {!isLoading && (
          <>
            <FeaturedCollection 
              title="New Arrivals" 
              description="Discover our latest collection of exquisite jewelry pieces"
              products={newArrivals}
              viewAllLink="/products?sort=new"
            />
            
            <section className="py-16 bg-secondary/50">
              <div className="container">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-serif mb-6">Timeless Elegance, Exceptional Craftsmanship</h2>
                  <p className="text-muted-foreground mb-8">
                    Each piece in our collection is meticulously crafted by master artisans
                    using only the finest materials and ethically sourced gemstones.
                    We combine traditional techniques with innovative design to create jewelry
                    that transcends trends and becomes a cherished heirloom.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="space-y-3">
                      <h3 className="font-serif text-xl">Exceptional Quality</h3>
                      <p className="text-sm text-muted-foreground">Meticulous attention to detail in every piece</p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-serif text-xl">Ethically Sourced</h3>
                      <p className="text-sm text-muted-foreground">Responsibly mined gemstones and metals</p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-serif text-xl">Timeless Design</h3>
                      <p className="text-sm text-muted-foreground">Classic elegance that transcends trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <FeaturedCollection 
              title="Bestsellers" 
              description="Our most sought-after pieces loved by customers worldwide"
              products={bestsellers}
              viewAllLink="/products?sort=bestsellers"
            />
          </>
        )}
      </main>
      
      <footer className="bg-black text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">LUXE<span className="text-gold">JEWEL</span></h3>
              <p className="text-sm text-gray-400">
                Exquisite jewelry crafted with passion, precision, and the finest materials.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/products" className="hover:text-white premium-transition">All Jewelry</a></li>
                <li><a href="/products?category=Rings" className="hover:text-white premium-transition">Rings</a></li>
                <li><a href="/products?category=Necklaces" className="hover:text-white premium-transition">Necklaces</a></li>
                <li><a href="/products?category=Earrings" className="hover:text-white premium-transition">Earrings</a></li>
                <li><a href="/products?category=Bracelets" className="hover:text-white premium-transition">Bracelets</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white premium-transition">Our Story</a></li>
                <li><a href="/craftsmanship" className="hover:text-white premium-transition">Craftsmanship</a></li>
                <li><a href="/sustainability" className="hover:text-white premium-transition">Sustainability</a></li>
                <li><a href="/contact" className="hover:text-white premium-transition">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/shipping" className="hover:text-white premium-transition">Shipping & Returns</a></li>
                <li><a href="/care" className="hover:text-white premium-transition">Jewelry Care</a></li>
                <li><a href="/faq" className="hover:text-white premium-transition">FAQs</a></li>
                <li><a href="/privacy" className="hover:text-white premium-transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} LUXEJEWEL. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              Designed with passion for exceptional jewelry experiences.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
