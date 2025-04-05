
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: string;
  material: string;
  purity?: string;
  gemstone?: string;
  occasion?: string;
  gender: string;
  goldWeight?: string;
  diamondCts?: string;
  isNew: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  images: string[];
  tags?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Diamond Radiance Ring",
    description: "Exquisite 18K white gold ring featuring a brilliant-cut diamond center stone surrounded by a halo of smaller diamonds for maximum sparkle.",
    price: 2999,
    category: "Rings",
    type: "Engagement Ring",
    material: "White Gold",
    purity: "18K",
    gemstone: "Diamond",
    occasion: "Wedding",
    gender: "Women",
    goldWeight: "4.5",
    diamondCts: "1.2",
    isNew: true,
    isBestseller: true,
    isTrending: true,
    tags: ["Wedding", "Engagement", "Gift"],
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "2",
    name: "Sapphire Eternity Band",
    description: "Timeless 18K yellow gold eternity band set with vibrant blue sapphires, symbolizing endless love and devotion.",
    price: 1850,
    category: "Rings",
    type: "Wedding Band",
    material: "Yellow Gold",
    purity: "18K",
    gemstone: "Sapphire",
    occasion: "Anniversary",
    gender: "Women",
    isNew: false,
    isBestseller: true,
    isTrending: false,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "3",
    name: "Platinum Chain Necklace",
    description: "Sophisticated platinum chain necklace with a sleek, minimalist design for everyday luxury.",
    price: 1250,
    category: "Necklaces",
    type: "Pendent Necklace",
    material: "Platinum",
    occasion: "Daily",
    gender: "Unisex",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "4",
    name: "Ruby Signature Bracelet",
    description: "Statement 22K gold bracelet featuring vibrant ruby gemstones in an artful arrangement, perfect for special occasions.",
    price: 3200,
    category: "Bracelets",
    type: "Tennis Bracelet",
    material: "Gold",
    purity: "22K",
    gemstone: "Ruby",
    occasion: "Party",
    gender: "Women",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1611591437268-c96582786b12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "5",
    name: "Diamond Drop Earrings",
    description: "Elegant white gold drop earrings featuring brilliant-cut diamonds that catch the light with every movement.",
    price: 1700,
    category: "Earrings",
    type: "Drop Earrings",
    material: "White Gold",
    purity: "18K",
    gemstone: "Diamond",
    occasion: "Festive",
    gender: "Women",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "6",
    name: "Emerald Statement Ring",
    description: "Bold 18K rose gold ring featuring a striking emerald center stone surrounded by a halo of pavé diamonds.",
    price: 2450,
    category: "Rings",
    type: "Cocktail Ring",
    material: "Rose Gold",
    purity: "18K",
    gemstone: "Emerald",
    occasion: "Party",
    gender: "Women",
    isNew: false,
    isBestseller: true,
    isTrending: false,
    images: [
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "7",
    name: "Minimalist Pearl Necklace",
    description: "Refined 18K gold necklace featuring a single freshwater pearl pendant, perfect for everyday elegance.",
    price: 950,
    category: "Necklaces",
    type: "Pendent Necklace",
    material: "Gold",
    purity: "18K",
    gemstone: "Pearl",
    occasion: "Daily",
    gender: "Women",
    isNew: true,
    isBestseller: true,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
  {
    id: "8",
    name: "Classic Gold Cufflinks",
    description: "Sophisticated 22K gold cufflinks with a polished finish, perfect for formal occasions.",
    price: 850,
    category: "Brooches & Pins",
    type: "Refined Luxury",
    material: "Gold",
    purity: "22K",
    occasion: "Formal",
    gender: "Men",
    isNew: false,
    isBestseller: false,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1572708609331-f373cs7e5548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1585216808530-05ebd678b58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ]
  },
];

export const categories = [
  { name: "Rings", count: 3 },
  { name: "Necklaces", count: 2 },
  { name: "Pendants", count: 1 },
  { name: "Earrings", count: 1 },
  { name: "Bracelets", count: 1 },
  { name: "Bangles", count: 0 },
  { name: "Brooches & Pins", count: 1 },
];

export const filters = {
  types: [
    "Solitaire Ring", 
    "Engagement Ring", 
    "Wedding Band", 
    "Stackable Rings", 
    "Cocktail Ring", 
    "Statement Rings",
    "Minimalist Rings",
    "Floral Rings",
    "Everyday Elegance Rings",
    "Tennis Necklace", 
    "Choker", 
    "Pendent Necklace", 
    "Statement Necklaces",
    "Halo Pendants",
    "Solaitre Pendants",
    "Stud Earrings", 
    "Hoop Earrings", 
    "Drop Earrings", 
    "Chandelier Earrings", 
    "Statement Earrings",
    "Solaitre Earrings",
    "Halo Earrings",
    "Jhumkas",
    "Kundan classics",
    "Tennis Bracelet", 
    "Cuff Bracelet", 
    "Stackable Bracelets", 
    "Statement Bracelets",
    "Statement Bangles",
    "Refined Luxury"
  ],
  materials: ["White Gold", "Yellow Gold", "Rose Gold", "Platinum", "Gold", "Silver"],
  purities: ["18K", "22K", "24K"],
  gemstones: ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "Turmalines"],
  occasions: ["Wedding", "Anniversary", "Party", "Daily", "Festive", "Formal"],
  genders: ["Men", "Women", "Unisex", "Kids"],
  goldWeightRanges: ["0-5g", "5-10g", "10-20g", "20-50g", "50g+"],
  diamondCtsRanges: ["0-0.5cts", "0.5-1cts", "1-2cts", "2-5cts", "5cts+"]
};

