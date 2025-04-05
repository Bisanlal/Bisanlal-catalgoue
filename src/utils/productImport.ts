
import { Product } from '@/data/products';

/**
 * Validates and transforms CSV data into product objects
 * @param csvData - Raw CSV data string
 * @returns Array of Product objects
 */
export const importProductsFromCSV = (csvData: string): Product[] => {
  // Split the CSV into lines
  const lines = csvData.split('\n').filter(line => line.trim());
  
  // Get headers from first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse each line into a product object
  const products: Product[] = [];
  const importBatchSize = 250; // Process in batches to avoid memory issues
  
  for (let i = 1; i < lines.length; i++) {
    // Process batches and chunk the products
    if (products.length >= importBatchSize && products.length % importBatchSize === 0) {
      // Save current batch to temporary storage to avoid memory issues with large imports
      const existingBatches = JSON.parse(localStorage.getItem('tempImportBatches') || '[]');
      existingBatches.push(products.splice(0, products.length)); // Move all processed items to temp storage
      try {
        localStorage.setItem('tempImportBatches', JSON.stringify(existingBatches));
      } catch (err) {
        console.warn('Storage limit reached during batch processing. Some products may not be imported.');
      }
    }
    
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.error(`Line ${i + 1} has invalid number of columns`);
      continue;
    }
    
    const product: Partial<Product> = {};
    
    // Map values to product properties
    headers.forEach((header, index) => {
      const value = values[index].trim();
      
      switch (header.toLowerCase()) {
        case 'id':
          product.id = value;
          break;
        case 'name':
          product.name = value;
          break;
        case 'description':
          // Truncate long descriptions to save space
          product.description = value.length > 200 ? value.substring(0, 200) + '...' : value;
          break;
        case 'price':
          product.price = parseFloat(value);
          break;
        case 'category':
          product.category = value;
          break;
        case 'type':
          product.type = value;
          break;
        case 'material':
          product.material = value;
          break;
        case 'purity':
          product.purity = value || undefined;
          break;
        case 'gemstone':
          product.gemstone = value || undefined;
          break;
        case 'occasion':
          product.occasion = value || undefined;
          break;
        case 'gender':
          product.gender = value;
          break;
        case 'isnew':
        case 'is_new':
          product.isNew = value.toLowerCase() === 'true';
          break;
        case 'isbestseller':
        case 'is_bestseller':
          product.isBestseller = value.toLowerCase() === 'true';
          break;
        case 'istrending':
        case 'is_trending':
          product.isTrending = value.toLowerCase() === 'true';
          break;
        case 'images':
          // Limit to just a few images to save space
          const allImages = value.split('|').map(img => img.trim());
          product.images = allImages.slice(0, 2); // Limit to 2 images per product
          break;
      }
    });
    
    // Validate the product
    if (isValidProduct(product as Product)) {
      products.push(product as Product);
    } else {
      console.error(`Invalid product at line ${i + 1}:`, product);
    }
  }
  
  // If we had batches in temp storage, restore and combine
  try {
    const existingBatches = JSON.parse(localStorage.getItem('tempImportBatches') || '[]');
    if (existingBatches.length > 0) {
      // Flatten all batches and combine with current products
      const allProducts = [...existingBatches.flat(), ...products];
      // Clear temporary storage
      localStorage.removeItem('tempImportBatches');
      return allProducts;
    }
  } catch (err) {
    console.warn('Error processing batched imports:', err);
  }
  
  return products;
};

/**
 * Parse a CSV line correctly handling quoted values
 */
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Don't forget the last value
  values.push(currentValue);
  
  return values;
};

/**
 * Validate required product fields
 */
const isValidProduct = (product: Product): boolean => {
  return Boolean(
    product.id &&
    product.name &&
    product.description &&
    !isNaN(product.price) &&
    product.category &&
    product.type &&
    product.material &&
    product.gender &&
    Array.isArray(product.images) &&
    product.images.length > 0
  );
};

/**
 * Sample CSV format template
 */
export const getCSVTemplate = (): string => {
  return `id,name,description,price,category,type,material,purity,gemstone,occasion,gender,isNew,isBestseller,isTrending,images
1,"Diamond Ring","Beautiful diamond ring",45000,Rings,Engagement,"White Gold",18K,Diamond,Wedding,Women,true,false,true,"https://example.com/image1.jpg|https://example.com/image2.jpg"
`;
};
