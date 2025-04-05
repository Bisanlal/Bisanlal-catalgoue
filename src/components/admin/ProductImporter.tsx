
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { importProductsFromCSV, getCSVTemplate } from '@/utils/productImport';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';
import { AlertCircle, Info } from 'lucide-react';

interface ProductImporterProps {
  onImportComplete?: (products: Product[]) => void;
}

const ProductImporter = ({ onImportComplete }: ProductImporterProps) => {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [storageUsage, setStorageUsage] = useState<number | null>(null);
  const [storageLimit, setStorageLimit] = useState<number | null>(null);
  const { toast } = useToast();

  // Calculate current localStorage usage
  useEffect(() => {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      }
      
      // Convert to KB
      setStorageUsage(Math.round(total / 1024));
      
      // Estimate quota (typically 5-10MB)
      setStorageLimit(5 * 1024); // 5MB in KB as a conservative estimate
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  }, [isImporting]);

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Import Error",
        description: "Please paste CSV data first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImporting(true);
      
      // Show processing notification for large imports
      const lineCount = csvData.split('\n').length - 1;
      if (lineCount > 500) {
        toast({
          title: "Processing Large Import",
          description: `Importing ${lineCount} products. This may take a moment...`,
        });
      }
      
      // Process import in chunks for very large imports
      const importedProducts = importProductsFromCSV(csvData);
      
      if (importedProducts.length === 0) {
        toast({
          title: "Import Error",
          description: "No valid products found in the CSV data",
          variant: "destructive"
        });
        return;
      }
      
      // For large imports, store in chunks to prevent storage limits
      if (importedProducts.length > 500) {
        // Store in batches of 500
        try {
          const existingProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
          
          // Process in chunks of 500
          const chunks = [];
          for (let i = 0; i < importedProducts.length; i += 500) {
            chunks.push(importedProducts.slice(i, i + 500));
          }
          
          // Save each chunk
          let successfullyImported = 0;
          for (let i = 0; i < chunks.length; i++) {
            try {
              const combinedProducts = [...existingProducts, ...chunks[i]];
              localStorage.setItem('customProducts', JSON.stringify(combinedProducts));
              successfullyImported += chunks[i].length;
              
              // Update existing products reference for next chunk
              if (i < chunks.length - 1) {
                localStorage.getItem('customProducts');
              }
            } catch (storageError) {
              console.error('Storage quota exceeded during chunk import:', storageError);
              toast({
                title: "Partial Import",
                description: `Imported ${successfullyImported} products. Storage limit reached.`,
                variant: "destructive"
              });
              break;
            }
          }
          
          // Update timestamp for refresh
          localStorage.setItem('productsUpdatedAt', Date.now().toString());
          
          toast({
            title: "Import Successful",
            description: `${successfullyImported} products imported successfully`,
          });
        } catch (err) {
          console.error('Error during chunked import:', err);
          toast({
            title: "Import Error",
            description: "Failed to save all products. Try with fewer products.",
            variant: "destructive"
          });
        }
      } else {
        // For smaller imports, use the normal approach
        try {
          const existingProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
          localStorage.setItem('customProducts', JSON.stringify([...existingProducts, ...importedProducts]));
          
          // Update timestamp for refresh
          localStorage.setItem('productsUpdatedAt', Date.now().toString());
          
          toast({
            title: "Import Successful",
            description: `${importedProducts.length} products imported successfully`,
          });
        } catch (storageError) {
          console.error('Storage error during import:', storageError);
          toast({
            title: "Import Error",
            description: "Storage limit reached. Try importing fewer products.",
            variant: "destructive"
          });
        }
      }

      if (onImportComplete) {
        onImportComplete(importedProducts);
      }

      // Reset the textarea
      setCsvData('');
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Error",
        description: "Failed to import products. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleGetTemplate = () => {
    setCsvData(getCSVTemplate());
    toast({
      title: "Template Loaded",
      description: "CSV template has been loaded. You can modify it with your data."
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Bulk Product Import</h2>
      
      {storageUsage !== null && storageLimit !== null && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-md">
          <Info size={18} />
          <div>
            <p className="text-sm font-medium">
              Storage Usage: {storageUsage} KB / ~{storageLimit} KB 
              ({Math.round((storageUsage / storageLimit) * 100)}%)
            </p>
            <p className="text-xs text-blue-600">
              {storageUsage > storageLimit * 0.8 ? 
                "Storage space is limited. Consider removing unused products." : 
                "Storage space available for product imports."}
            </p>
          </div>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground">
        Paste your CSV data below to import multiple products at once. 
        Each row represents one product.
      </p>
      
      <div className="flex gap-2">
        <Button onClick={handleGetTemplate} variant="outline" size="sm">
          Get CSV Template
        </Button>
      </div>
      
      <Textarea
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        placeholder="Paste CSV data here..."
        className="min-h-[200px] font-mono text-sm"
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleImport} 
          disabled={isImporting}
        >
          {isImporting ? "Importing..." : "Import Products"}
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p className="mb-1">For large imports (1000+ products):</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Import in smaller batches of 500-1000 products at a time</li>
          <li>Limit image URLs to 1-2 per product to save space</li>
          <li>Keep descriptions concise to optimize storage</li>
          <li>Consider removing unused products before importing new ones</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductImporter;
