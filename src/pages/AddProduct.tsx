
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, ArrowLeft, Plus, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { filters, categories } from '@/data/products';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useProductSync } from '@/hooks/use-product-sync';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Animation variants that are slightly slower for a premium feel
const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" } // Slightly slower but smoother animation
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.4, ease: "easeInOut" } // Smoother exit animation
  }
};

const AddProduct = () => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [material, setMaterial] = useState('');
  const [purity, setPurity] = useState('');
  const [gemstone, setGemstone] = useState('');
  const [goldWeight, setGoldWeight] = useState('');
  const [diamondCts, setDiamondCts] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedTags, setSavedTags] = useLocalStorage<string[]>('savedTags', []);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const { refreshProducts } = useProductSync();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.classList.add('border-[#edbdb7]');
    }
  };

  const handleDragLeave = () => {
    if (dragAreaRef.current) {
      dragAreaRef.current.classList.remove('border-[#edbdb7]');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDragLeave();

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles: File[] = [];
    const videoFiles: File[] = [];
    const newImagePreviews: string[] = [];
    const newVideoPreviews: string[] = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        imageFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          newImagePreviews.push(reader.result as string);
          if (newImagePreviews.length === imageFiles.length) {
            setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        videoFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          newVideoPreviews.push(reader.result as string);
          if (newVideoPreviews.length === videoFiles.length) {
            setVideoPreviewUrls([...videoPreviewUrls, ...newVideoPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setImages([...images, ...imageFiles]);
    setVideos([...videos, ...videoFiles]);

    toast({
      description: `Added ${imageFiles.length} images and ${videoFiles.length} videos`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newImageUrls = [...imagePreviewUrls];
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    setImages(newImages);
    setImagePreviewUrls(newImageUrls);
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = [...videos];
    const newVideoUrls = [...videoPreviewUrls];
    newVideos.splice(index, 1);
    newVideoUrls.splice(index, 1);
    setVideos(newVideos);
    setVideoPreviewUrls(newVideoUrls);
  };

  const handleTagChange = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (!savedTags.includes(tagInput)) {
        setSavedTags([...savedTags, tagInput]);
      }
      if (!selectedTags.includes(tagInput)) {
        setSelectedTags([...selectedTags, tagInput]);
      }
      setTagInput('');
    }
  };

  const handleAddOccasion = () => {
    if (selectedOccasion && !occasions.includes(selectedOccasion)) {
      setOccasions([...occasions, selectedOccasion]);
      setSelectedOccasion('');
    }
  };

  const handleRemoveOccasion = (index: number) => {
    const newOccasions = [...occasions];
    newOccasions.splice(index, 1);
    setOccasions(newOccasions);
  };

  const handleSaveProduct = () => {
    try {
      // Validation
      if (!name.trim()) {
        toast({
          title: "Missing information",
          description: "Product name is required",
          variant: "destructive"
        });
        return;
      }
      
      if (!category) {
        toast({
          title: "Missing information",
          description: "Category is required",
          variant: "destructive"
        });
        return;
      }
      
      // Combine imagePreviewUrls and videoPreviewUrls for the product images
      const allMediaUrls = [...imagePreviewUrls, ...videoPreviewUrls];
      
      // Check if we have too many images (localStorage has limits)
      if (allMediaUrls.length > 5) {
        toast({
          title: "Too many images/videos",
          description: "Please limit to 5 images/videos total to avoid storage issues",
          variant: "destructive"
        });
        return;
      }
      
      // Get existing products
      const existingProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
      
      // Create new product
      const newProduct = {
        id: `custom-${Date.now()}`,
        name,
        description,
        price: 0,
        category,
        type,
        material,
        purity,
        gemstone,
        occasion: occasions.join(', '),
        gender: "Unisex",
        goldWeight,
        diamondCts,
        isNew: true,
        isBestseller: false,
        isTrending: false,
        images: allMediaUrls.length > 0 
          ? allMediaUrls 
          : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e"],
        tags: selectedTags
      };
      
      // Update localStorage (with error handling for quota exceeded)
      try {
        localStorage.setItem('customProducts', JSON.stringify([...existingProducts, newProduct]));
        
        // Update products timestamp to trigger refresh across the app
        refreshProducts();
        
        // Success notification
        toast({
          title: "Product added",
          description: "The product has been added to your catalog",
        });
        
        // Reset form
        resetForm();
      } catch (storageError) {
        console.error("Storage error:", storageError);
        
        // Handle quota exceeded error
        toast({
          title: "Storage limit reached",
          description: "Try removing some products or images first",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save the product. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setImages([]);
    setVideos([]);
    setImagePreviewUrls([]);
    setVideoPreviewUrls([]);
    setName('');
    setDescription('');
    setCategory('');
    setType('');
    setMaterial('');
    setPurity('');
    setGemstone('');
    setGoldWeight('');
    setDiamondCts('');
    setSelectedTags([]);
    setOccasions([]);
  };

  return (
    <motion.div 
      className="min-h-screen bg-white p-4 md:p-8"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeVariants}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-black hover:text-gray-700 mr-4 transition-colors duration-300">
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Link>
          <h1 className="text-2xl font-medium">Add New Product</h1>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={fadeVariants}
        >
          <div>
            <h2 className="text-lg font-medium mb-4">Product Images & Videos</h2>
            
            <div 
              ref={dragAreaRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 transition-colors duration-300 hover:border-gray-400"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={40} />
              <p className="text-gray-600 mb-2">Drag and drop your files here</p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#edbdb7] text-black rounded-md hover:bg-[#e9ada7] transition-colors duration-300"
                >
                  Upload Images
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Upload Videos
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
              />
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                multiple
                accept="video/*"
                onChange={handleFileInputChange}
              />
              <p className="text-gray-400 text-xs mt-4">
                Note: Please limit to 5 total images/videos to avoid storage issues
              </p>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Images ({imagePreviewUrls.length})</h3>
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden aspect-square transition-all duration-300 hover:shadow-md group">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <button
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoPreviewUrls.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Videos ({videoPreviewUrls.length})</h3>
                <div className="grid grid-cols-3 gap-4">
                  {videoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden aspect-video bg-gray-100 transition-all duration-300 hover:shadow-md group">
                      <video 
                        src={url} 
                        className="w-full h-full object-cover" 
                        controls 
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        onClick={() => handleRemoveVideo(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Product Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md transition-colors duration-300 hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md transition-colors duration-300 hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                  rows={3}
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors duration-300 hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type*
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors duration-300 hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    {filters.types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material*
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    required
                  >
                    <option value="">Select Material</option>
                    {filters.materials.map((material) => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purity
                  </label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                  >
                    <option value="">Select Purity</option>
                    {filters.purities.map((purity) => (
                      <option key={purity} value={purity}>{purity}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gold Weight (grams)
                  </label>
                  <input
                    type="number"
                    value={goldWeight}
                    onChange={(e) => setGoldWeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    placeholder="Enter gold weight"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diamond Weight (cts)
                  </label>
                  <input
                    type="number"
                    value={diamondCts}
                    onChange={(e) => setDiamondCts(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    placeholder="Enter diamond weight"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gemstone
                </label>
                <select
                  value={gemstone}
                  onChange={(e) => setGemstone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                >
                  <option value="">Select Gemstone</option>
                  {filters.gemstones.map((gemstone) => (
                    <option key={gemstone} value={gemstone}>{gemstone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occasions
                </label>
                <div className="flex">
                  <select
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                  >
                    <option value="">Select Occasion</option>
                    {filters.occasions.map((occasion) => (
                      <option key={occasion} value={occasion}>{occasion}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddOccasion}
                    className="px-3 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 transition-colors"
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {occasions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Occasions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((occasion, index) => (
                      <Badge 
                        key={index} 
                        className="bg-[#edbdb7] text-black hover:bg-[#e9ada7] px-3 py-1 text-sm flex items-center"
                      >
                        {occasion}
                        <button
                          className="ml-2"
                          onClick={() => handleRemoveOccasion(index)}
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Filter Options)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag, index) => (
                    <Badge key={index} className="bg-[#edbdb7] text-black hover:bg-[#e9ada7] px-3 py-1 text-sm flex items-center">
                      {tag}
                      <button
                        className="ml-2"
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md transition-colors hover:border-gray-400 focus:border-[#edbdb7] focus:ring-1 focus:ring-[#edbdb7] focus:outline-none"
                    placeholder="Add custom tag and press Enter"
                  />
                  <button
                    onClick={() => {
                      if (tagInput.trim() !== '') {
                        if (!savedTags.includes(tagInput)) {
                          setSavedTags([...savedTags, tagInput]);
                        }
                        if (!selectedTags.includes(tagInput)) {
                          setSelectedTags([...selectedTags, tagInput]);
                        }
                        setTagInput('');
                      }
                    }}
                    className="px-3 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {savedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-[#edbdb7] text-black border-[#edbdb7]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={handleSaveProduct}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300 hover:shadow-md"
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
              >
                Save Product
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddProduct;
