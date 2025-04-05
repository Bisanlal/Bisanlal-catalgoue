
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Search, Plus, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, products as defaultProducts } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editMode, setEditMode] = useState<'custom' | 'default' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [allMaterials, setAllMaterials] = useState<string[]>([]);
  const [allPurities, setAllPurities] = useState<string[]>([]);
  const [allGemstones, setAllGemstones] = useState<string[]>([]);
  const [allOccasions, setAllOccasions] = useState<string[]>([]);
  const [allGenders, setAllGenders] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    const editedProducts = JSON.parse(localStorage.getItem('editedProducts') || '{}');
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    
    const filteredDefaultProducts = defaultProducts
      .filter(product => !deletedProducts.includes(product.id))
      .map(product => {
        let finalProduct = { ...product };
        
        if (editedProducts[product.id]) {
          finalProduct = editedProducts[product.id];
        }
        
        return finalProduct;
      });
    
    const combinedProducts = [...filteredDefaultProducts, ...customProducts];
    setAllProducts(combinedProducts);
    
    // Extract all unique categories, types, etc.
    const categories = new Set<string>();
    const types = new Set<string>();
    const materials = new Set<string>();
    const purities = new Set<string>();
    const gemstones = new Set<string>();
    const occasions = new Set<string>();
    const genders = new Set<string>();
    const allTags = new Set<string>();

    combinedProducts.forEach(product => {
      if (product.category) categories.add(product.category);
      if (product.type) types.add(product.type);
      if (product.material) materials.add(product.material);
      if (product.purity) purities.add(product.purity);
      if (product.gemstone) gemstones.add(product.gemstone);
      if (product.occasion) occasions.add(product.occasion);
      if (product.gender) genders.add(product.gender);
      
      if (product.tags) {
        product.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    setAllCategories([...categories]);
    setAllTypes([...types]);
    setAllMaterials([...materials]);
    setAllPurities([...purities]);
    setAllGemstones([...gemstones]);
    setAllOccasions([...occasions]);
    setAllGenders([...genders]);
    
    const savedTags = localStorage.getItem('productTags');
    if (savedTags) {
      const parsedTags = JSON.parse(savedTags);
      const mergedTags = [...new Set([...parsedTags, ...allTags])];
      setTags(mergedTags);
    } else {
      setTags([...allTags]);
    }
  };

  useEffect(() => {
    localStorage.setItem('productTags', JSON.stringify(tags));
  }, [tags]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      
      toast({
        description: `Tag "${newTag.trim()}" has been added`,
      });
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditedProduct({...product});
    setEditDialogOpen(true);
    setEditMode(product.id.startsWith('custom-') ? 'custom' : 'default');
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    
    if (productToDelete.id.startsWith('custom-')) {
      const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
      const updatedProducts = customProducts.filter((p: Product) => p.id !== productToDelete.id);
      localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
      
      setAllProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      
      toast({
        description: `${productToDelete.name} has been deleted`,
      });
    } else {
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      deletedProducts.push(productToDelete.id);
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
      
      setAllProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      
      toast({
        description: `${productToDelete.name} has been removed from the catalog`,
      });
    }
    
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    
    localStorage.setItem('productsUpdatedAt', Date.now().toString());
  };

  const handleSaveEdit = () => {
    if (!editingProduct || !editedProduct) return;

    const cleanedProduct = { ...editedProduct };
    Object.keys(cleanedProduct).forEach((key) => {
      if (key !== 'description' && key !== 'tags' && key !== 'images') {
        if (cleanedProduct[key] === '') {
          cleanedProduct[key] = undefined;
        }
      }
    });

    try {
      if (editMode === 'custom') {
        const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
        const updatedProducts = customProducts.map((p: Product) => 
          p.id === editingProduct.id ? cleanedProduct : p
        );
        localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
      } else if (editMode === 'default') {
        const editedProducts = JSON.parse(localStorage.getItem('editedProducts') || '{}');
        editedProducts[editingProduct.id] = cleanedProduct;
        localStorage.setItem('editedProducts', JSON.stringify(editedProducts));
      }
      
      setAllProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? cleanedProduct : p)
      );
      
      localStorage.setItem('productsUpdatedAt', Date.now().toString());
      
      toast({
        description: `${cleanedProduct.name} has been updated successfully`,
      });
      
      setEditDialogOpen(false);
      setEditingProduct(null);
      setEditedProduct(null);
      setEditMode(null);
    } catch (error) {
      console.error("Error saving edit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again."
      });
    }
  };

  const toggleProductTag = (tag: string) => {
    if (!editedProduct) return;
    
    const currentTags = editedProduct.tags || [];
    let newTags;
    
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    
    setEditedProduct({
      ...editedProduct,
      tags: newTags
    });
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProduct) return;
    
    const videoUrl = e.target.value.trim();
    if (!videoUrl) return;
    
    // Update images array with video URL
    const currentImages = [...(editedProduct.images || [])];
    currentImages[currentImageIndex] = videoUrl;
    
    setEditedProduct({
      ...editedProduct,
      images: currentImages
    });
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddImage = () => {
    if (!editedProduct) return;
    
    const currentImages = [...(editedProduct.images || [])];
    currentImages.push('');
    
    setEditedProduct({
      ...editedProduct,
      images: currentImages
    });
    
    setCurrentImageIndex(currentImages.length - 1);
  };

  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-black hover:text-gray-700 mr-4 transition-colors duration-300">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-medium">Admin Panel</h1>
          </div>
          <Link 
            to="/add-product"
            className="bg-[#edbdb7] hover:bg-[#e9ada7] text-black px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            <Plus size={18} />
            Add New Product
          </Link>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search products by name, category, or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Product Tags</h2>
            <div className="flex gap-2">
              <Input
                placeholder="New tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleAddTag} variant="outline">Add Tag</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span key={tag} className="bg-[#edbdb7]/10 text-black px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-[#edbdb7]/20">
                {tag}
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-sm text-gray-500">No tags yet. Add some tags to use in filters.</span>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Material</th>
                <th className="p-3 text-left">Details</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3">
                    <div className="w-16 h-16 rounded overflow-hidden shadow-sm">
                      {product.images[0]?.endsWith('.mp4') || product.images[0]?.includes('video') ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Video size={24} className="text-gray-400" />
                        </div>
                      ) : (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-gray-600">{product.category}</td>
                  <td className="p-3 text-gray-600">
                    {product.material}
                    {product.purity && `, ${product.purity}`}
                  </td>
                  <td className="p-3">
                    <div className="space-y-1 text-sm">
                      {product.goldWeight && (
                        <p>Gold: {product.goldWeight}g</p>
                      )}
                      {product.diamondCts && (
                        <p>Diamond: {product.diamondCts}cts</p>
                      )}
                      {product.gemstone && (
                        <p>Gemstone: {product.gemstone}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="View Details"
                      >
                        <Search size={18} />
                      </Link>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-500 transition-colors duration-200"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-200"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          {editedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editedProduct.category}
                    onValueChange={(value) => setEditedProduct({...editedProduct, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={editedProduct.type}
                    onValueChange={(value) => setEditedProduct({...editedProduct, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {allTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={editedProduct.gender}
                    onValueChange={(value) => setEditedProduct({...editedProduct, gender: value})}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {allGenders.map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select 
                    value={editedProduct.material}
                    onValueChange={(value) => setEditedProduct({...editedProduct, material: value})}
                  >
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMaterials.map(material => (
                        <SelectItem key={material} value={material}>{material}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purity">Purity</Label>
                  <Select 
                    value={editedProduct.purity || "none"}
                    onValueChange={(value) => setEditedProduct({...editedProduct, purity: value === "none" ? undefined : value})}
                  >
                    <SelectTrigger id="purity">
                      <SelectValue placeholder="Select purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {allPurities.map(purity => (
                        <SelectItem key={purity} value={purity}>{purity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goldWeight">Gold Weight (grams)</Label>
                  <Input 
                    id="goldWeight" 
                    type="number" 
                    step="0.01"
                    value={editedProduct.goldWeight || ""}
                    onChange={(e) => setEditedProduct({...editedProduct, goldWeight: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diamondCts">Diamond Weight (carats)</Label>
                  <Input 
                    id="diamondCts" 
                    type="number" 
                    step="0.01"
                    value={editedProduct.diamondCts || ""}
                    onChange={(e) => setEditedProduct({...editedProduct, diamondCts: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gemstone">Gemstone</Label>
                  <Select 
                    value={editedProduct.gemstone || "none"}
                    onValueChange={(value) => setEditedProduct({...editedProduct, gemstone: value === "none" ? undefined : value})}
                  >
                    <SelectTrigger id="gemstone">
                      <SelectValue placeholder="Select gemstone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {allGemstones.map(gemstone => (
                        <SelectItem key={gemstone} value={gemstone}>{gemstone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <Select 
                    value={editedProduct.occasion || "none"}
                    onValueChange={(value) => setEditedProduct({...editedProduct, occasion: value === "none" ? undefined : value})}
                  >
                    <SelectTrigger id="occasion">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {allOccasions.map(occasion => (
                        <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Product Images & Videos */}
              <div className="space-y-2">
                <Label>Images & Videos</Label>
                <div className="flex gap-2 mb-2">
                  {editedProduct.images.map((image, index) => (
                    <div 
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-14 h-14 rounded-md border-2 cursor-pointer ${
                        index === currentImageIndex ? 'border-[#edbdb7]' : 'border-gray-200'
                      }`}
                    >
                      {image?.endsWith('.mp4') || image?.includes('video') ? (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <Video size={20} className="text-gray-500" />
                        </div>
                      ) : (
                        <img 
                          src={image || '/placeholder.svg'} 
                          alt={`Product ${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={handleAddImage}
                    className="w-14 h-14 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Plus size={20} className="text-gray-400" />
                  </button>
                </div>
                
                {/* Image/Video URL input */}
                <div className="space-y-2">
                  <Label>Selected Image/Video URL</Label>
                  <Input 
                    value={editedProduct.images[currentImageIndex] || ''}
                    onChange={handleVideoUrlChange}
                    placeholder="Enter image or video URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    For videos, paste a direct .mp4 URL or any URL containing "video"
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  value={editedProduct.description || ""}
                  onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Product Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <div 
                      key={tag} 
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1 transition-colors duration-200 ${
                        editedProduct.tags?.includes(tag) 
                          ? 'bg-[#edbdb7] text-black' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleProductTag(tag)}
                    >
                      <span>{tag}</span>
                      {editedProduct.tags?.includes(tag) && <span>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isNew" 
                    checked={editedProduct.isNew}
                    onCheckedChange={(checked) => 
                      setEditedProduct({...editedProduct, isNew: Boolean(checked)})
                    }
                  />
                  <Label htmlFor="isNew">Mark as New</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isBestseller" 
                    checked={editedProduct.isBestseller}
                    onCheckedChange={(checked) => 
                      setEditedProduct({...editedProduct, isBestseller: Boolean(checked)})
                    }
                  />
                  <Label htmlFor="isBestseller">Mark as Bestseller</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#edbdb7] hover:bg-[#e9ada7] text-black">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
