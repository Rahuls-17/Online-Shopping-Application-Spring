export interface Category {
    id: number;
    name: string;
}

export interface ProductImage {
    id: number;
    imageUrl: string;
}

export interface ProductReview {
    id: number;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string | null;
    stock: number;
    brand: string;
    rating: number;
    category: Category;
    images: ProductImage[] | null;
    specifications: string | null; 
}

export interface HomepageSection {
  id: number;
  title: string;
  sectionOrder: number;
  productIds: number[];
  products?: Product[]; 
}

export interface RatingSummary {
  averageRating: number;
  totalRatingCount: number;
  totalReviewCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}
