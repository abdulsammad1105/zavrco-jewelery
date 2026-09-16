// Plain type mirrors of the backend's database schema.
// The frontend never talks to the database directly — these types only
// describe the shape of JSON the backend API returns.

export type OrderItemData = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  createdAt: string;
};

export type Collection = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  images: string[];
  categoryId: number | null;
  collectionId: number | null;
  stock: number;
  featured: boolean;
  material: string | null;
  dimensions: string | null;
  care: string | null;
  isNew: boolean;
  published: boolean;
  createdAt: string;
};

export type Order = {
  id: number;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  items: OrderItemData[];
  subtotal: string;
  shipping: string;
  total: string;
  status: string;
  paymentMethod: string;
  paymentProof: string | null;
  userId: number | null;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
};

export type AdminLog = {
  id: number;
  action: string;
  entityType: string;
  entityId: number | null;
  description: string;
  createdAt: string;
};

export type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  productId: number | null;
  published: boolean;
  createdAt: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
};
