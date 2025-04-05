
import { Link } from 'react-router-dom';
import { Upload, Grid, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// Updated animation variants for a premium feel
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" } // Slower, smoother animation
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: "easeInOut" } // Smoother exit animation
  }
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slower stagger for premium feel
      ease: "easeOut"
    }
  }
};

const Home = () => {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeVariants}
    >
      <div className="container mx-auto py-16 px-4">
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
          variants={fadeVariants}
        >
          <motion.div 
            className="bg-white p-4 rounded-lg shadow-sm w-full max-w-lg mb-6 transition-all duration-700 hover:shadow-golden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <img 
              src="/lovable-uploads/359520bd-0b84-47d6-9fdd-a94235e86480.png" 
              alt="Bisanlal Sitaram & Sons" 
              className="w-full"
            />
          </motion.div>
          <h2 className="text-2xl text-gray-800 mb-10 font-heading">100-Year-Old Legacy of Jewellery Making</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8"
            variants={staggerVariants}
          >
            <motion.div variants={fadeVariants} className="h-48">
              <Link 
                to="/add-product" 
                className="flex flex-col items-center justify-center p-6 bg-[#f1c2c3] hover:bg-[#eca6a7] text-black rounded-lg transition-all duration-700 shadow-sm hover:shadow-golden h-full"
              >
                <Upload size={32} className="mb-3 text-black" />
                <span className="text-lg font-heading">Add Products</span>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeVariants} className="h-48">
              <Link 
                to="/products" 
                className="flex flex-col items-center justify-center p-6 bg-navy hover:bg-navy-dark text-white rounded-lg transition-all duration-700 shadow-sm hover:shadow-golden h-full"
              >
                <Grid size={32} className="mb-3 text-white" />
                <span className="text-lg font-heading">Product Catalogue</span>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeVariants} className="h-48">
              <Link 
                to="/wishlist" 
                className="flex flex-col items-center justify-center p-6 bg-[#f1c2c3] hover:bg-[#eca6a7] text-black rounded-lg transition-all duration-700 shadow-sm hover:shadow-golden h-full"
              >
                <Heart size={32} className="mb-3 text-black" />
                <span className="text-lg font-heading">Customer Wishlists</span>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeVariants} className="h-48">
              <Link 
                to="/admin" 
                className="flex flex-col items-center justify-center p-6 bg-navy hover:bg-navy-dark text-white rounded-lg transition-all duration-700 shadow-sm hover:shadow-golden h-full"
              >
                <Settings size={32} className="mb-3 text-white" />
                <span className="text-lg font-heading">Admin Panel</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
