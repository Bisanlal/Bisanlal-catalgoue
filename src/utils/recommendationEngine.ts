
import { Product, categories, filters } from "@/data/products";

interface Preference {
  category: { [key: string]: number };
  type: { [key: string]: number };
  material: { [key: string]: number };
  gemstone: { [key: string]: number };
  occasion: { [key: string]: number };
  purity: { [key: string]: number };
  gender: { [key: string]: number };
  priceRange: { min: number; max: number };
}

/**
 * AI Recommendation Engine for personalized jewelry suggestions
 */
export class RecommendationEngine {
  private customerWishlists: Record<string, string[]>;
  private allProducts: Product[];
  private customerPreferences: Record<string, Preference> = {};

  constructor(customerWishlists: Record<string, string[]>, products: Product[]) {
    this.customerWishlists = customerWishlists;
    this.allProducts = products;
    this.analyzePreferences();
  }

  /**
   * Analyze customer preferences based on their wishlist
   */
  private analyzePreferences(): void {
    // For each customer
    Object.keys(this.customerWishlists).forEach(customerName => {
      const productIds = this.customerWishlists[customerName] || [];
      
      // Skip if no wishlisted products
      if (productIds.length === 0) return;
      
      // Initialize preferences
      const preference: Preference = {
        category: {},
        type: {},
        material: {},
        gemstone: {},
        occasion: {},
        purity: {},
        gender: {},
        priceRange: { min: Number.MAX_SAFE_INTEGER, max: 0 }
      };
      
      // Analyze wishlisted products
      productIds.forEach(productId => {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;
        
        // Update preferences based on product attributes
        this.incrementPreference(preference.category, product.category);
        this.incrementPreference(preference.type, product.type);
        this.incrementPreference(preference.material, product.material);
        if (product.gemstone) this.incrementPreference(preference.gemstone, product.gemstone);
        if (product.occasion) this.incrementPreference(preference.occasion, product.occasion);
        if (product.purity) this.incrementPreference(preference.purity, product.purity);
        this.incrementPreference(preference.gender, product.gender);
        
        // Track price range
        preference.priceRange.min = Math.min(preference.priceRange.min, product.price);
        preference.priceRange.max = Math.max(preference.priceRange.max, product.price);
      });
      
      // If min is still the initial value, reset it
      if (preference.priceRange.min === Number.MAX_SAFE_INTEGER) {
        preference.priceRange.min = 0;
      }
      
      // Store customer preferences
      this.customerPreferences[customerName] = preference;
    });
  }

  /**
   * Helper to increment a preference counter
   */
  private incrementPreference(preferenceObj: { [key: string]: number }, value: string): void {
    if (!value) return;
    preferenceObj[value] = (preferenceObj[value] || 0) + 1;
  }

  /**
   * Get personalized recommendations for a customer
   */
  public getRecommendations(customerName: string): Product[] {
    // If no customer or no preferences, return trending products
    if (!customerName || !this.customerPreferences[customerName]) {
      return this.allProducts.filter(p => p.isTrending).slice(0, 12);
    }
    
    const preferences = this.customerPreferences[customerName];
    const wishlistedIds = this.customerWishlists[customerName] || [];
    
    // Score each product based on customer preferences
    const scoredProducts = this.allProducts
      .filter(product => !wishlistedIds.includes(product.id)) // Don't recommend already wishlisted items
      .map(product => {
        let score = 0;
        
        // Calculate score based on matching preferences
        if (preferences.category[product.category]) {
          score += 3 * preferences.category[product.category];
        }
        
        if (preferences.type[product.type]) {
          score += 2 * preferences.type[product.type];
        }
        
        if (preferences.material[product.material]) {
          score += 2 * preferences.material[product.material];
        }
        
        if (product.gemstone && preferences.gemstone[product.gemstone]) {
          score += 3 * preferences.gemstone[product.gemstone];
        }
        
        if (product.occasion && preferences.occasion[product.occasion]) {
          score += 1.5 * preferences.occasion[product.occasion];
        }
        
        if (product.purity && preferences.purity[product.purity]) {
          score += 1 * preferences.purity[product.purity];
        }
        
        if (preferences.gender[product.gender]) {
          score += 1 * preferences.gender[product.gender];
        }
        
        // Boost score for trending and bestseller items
        if (product.isTrending) score += 1;
        if (product.isBestseller) score += 0.5;
        if (product.isNew) score += 0.3;
        
        // Price proximity factor (higher score for products in similar price range)
        const pref = preferences.priceRange;
        const priceRange = pref.max - pref.min;
        if (priceRange > 0) {
          const priceFactor = 1 - Math.min(
            Math.abs(product.price - (pref.min + priceRange / 2)) / priceRange, 
            1
          );
          score += priceFactor * 1.5;
        }
        
        return { product, score };
      });
    
    // Sort by score (descending) and return products
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, 12); // Return top 12 recommendations
  }

  /**
   * Get collaborative recommendations based on similar users
   */
  public getCollaborativeRecommendations(customerName: string): Product[] {
    // If no customer, return trending products
    if (!customerName || !this.customerWishlists[customerName]) {
      return this.allProducts.filter(p => p.isTrending).slice(0, 12);
    }
    
    const customerWishlist = this.customerWishlists[customerName] || [];
    
    // If customer has no wishlist, return bestsellers
    if (customerWishlist.length === 0) {
      return this.allProducts.filter(p => p.isBestseller).slice(0, 12);
    }
    
    // Find similar customers based on wishlist overlap
    const similarityScores: Record<string, number> = {};
    
    Object.keys(this.customerWishlists).forEach(otherCustomer => {
      // Skip if same customer
      if (otherCustomer === customerName) return;
      
      const otherWishlist = this.customerWishlists[otherCustomer] || [];
      if (otherWishlist.length === 0) return;
      
      // Count overlapping items
      let overlap = 0;
      customerWishlist.forEach(item => {
        if (otherWishlist.includes(item)) overlap++;
      });
      
      // Calculate Jaccard similarity coefficient
      const union = new Set([...customerWishlist, ...otherWishlist]).size;
      if (union > 0) {
        similarityScores[otherCustomer] = overlap / union;
      }
    });
    
    // Get products from similar customers' wishlists
    const recommendedProductIds = new Set<string>();
    
    // Sort customers by similarity (descending)
    const similarCustomers = Object.entries(similarityScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 similar customers
    
    // Get products from similar customers' wishlists
    similarCustomers.forEach(([customer, score]) => {
      const otherWishlist = this.customerWishlists[customer] || [];
      otherWishlist.forEach(itemId => {
        if (!customerWishlist.includes(itemId)) {
          recommendedProductIds.add(itemId);
        }
      });
    });
    
    // Convert product IDs to products
    const recommendations = Array.from(recommendedProductIds)
      .map(id => this.allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
    
    // If not enough recommendations, add content-based ones
    if (recommendations.length < 8) {
      const contentRecommendations = this.getRecommendations(customerName)
        .filter(p => !recommendations.some(r => r.id === p.id) && !customerWishlist.includes(p.id));
      
      recommendations.push(...contentRecommendations);
    }
    
    return recommendations.slice(0, 12); // Return top 12 recommendations
  }

  /**
   * Get hybrid recommendations (combining content-based and collaborative)
   */
  public getHybridRecommendations(customerName: string): Product[] {
    if (!customerName) {
      return this.allProducts.filter(p => p.isTrending || p.isBestseller).slice(0, 12);
    }
    
    // Get both types of recommendations
    const contentBased = this.getRecommendations(customerName);
    const collaborative = this.getCollaborativeRecommendations(customerName);
    
    // Combine and deduplicate
    const recommendations: Product[] = [];
    const addedIds = new Set<string>();
    
    // Alternate between content and collaborative recommendations
    const maxLength = Math.max(contentBased.length, collaborative.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < contentBased.length && !addedIds.has(contentBased[i].id)) {
        recommendations.push(contentBased[i]);
        addedIds.add(contentBased[i].id);
      }
      
      if (i < collaborative.length && !addedIds.has(collaborative[i].id)) {
        recommendations.push(collaborative[i]);
        addedIds.add(collaborative[i].id);
      }
    }
    
    // If we still need more, add trending products
    if (recommendations.length < 12) {
      const trending = this.allProducts
        .filter(p => p.isTrending && !addedIds.has(p.id))
        .slice(0, 12 - recommendations.length);
      
      recommendations.push(...trending);
    }
    
    return recommendations.slice(0, 12); // Return top 12
  }
}
