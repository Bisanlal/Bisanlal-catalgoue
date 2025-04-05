
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WishlistProvider } from "@/context/WishlistContext";
import { StrictMode } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail"; 
import Wishlist from "./pages/Wishlist";
import AddProduct from "./pages/AddProduct";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Animation wrapper
const AnimationLayout = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AnimationLayout />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
