import type { User, Product, Order, Payout } from './types';

// ─── Seller Stats ───────────────────────────────────

export const SELLER_STATS = {
  totalProducts: 48,
  activeListings: 42,
  totalOrders: 156,
  pendingOrders: 8,
  totalRevenue: 284500,
  pendingPayouts: 32000,
  avgRating: 4.6,
  lowStockItems: 3,
};

// ─── Admin Stats ────────────────────────────────────

export const ADMIN_STATS = {
  totalUsers: 1250,
  activeBuyers: 890,
  activeSellers: 145,
  pendingApprovals: 23,
  totalOrders: 3420,
  totalRevenue: 4850000,
  platformRevenue: 4850000,
  totalProducts: 2150,
  pendingProducts: 12,
  flaggedProducts: 3,
  unresolvedComplaints: 7,
  pendingPayments: 45,
};

// ─── Mock Users ─────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Pharma Plus Store',
    phone: '9876543210',
    email: 'pharmaplus@example.com',
    role: 'BUYER',
    status: 'APPROVED',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'MedSupply Wholesale',
    phone: '9876543211',
    email: 'medsupply@example.com',
    role: 'SELLER',
    status: 'APPROVED',
    createdAt: '2024-01-10T08:30:00Z',
  },
  {
    id: 'u3',
    name: 'HealthCare Distributors',
    phone: '9876543212',
    email: 'healthcare@example.com',
    role: 'SELLER',
    status: 'PENDING',
    createdAt: '2024-03-01T14:20:00Z',
  },
];

// ─── Mock Products ──────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Paracetamol 500mg',
    description: 'Fever and pain relief tablets',
    price: 35,
    mrp: 45,
    manufacturer: 'Cipla',
    stock: 500,
    rating: 4.5,
    reviewCount: 28,
    isEnabled: true,
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'p2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic capsules',
    price: 120,
    mrp: 150,
    manufacturer: 'Sun Pharma',
    stock: 200,
    rating: 4.3,
    reviewCount: 15,
    isEnabled: true,
    createdAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'p3',
    name: 'Omeprazole 20mg',
    description: 'Acid reflux capsules',
    price: 80,
    mrp: 95,
    manufacturer: 'Dr. Reddy\'s',
    stock: 8,
    rating: 4.7,
    reviewCount: 42,
    isEnabled: true,
    createdAt: '2024-02-10T13:00:00Z',
  },
  {
    id: 'p4',
    name: 'Aspirin 500mg',
    description: 'Fast-acting pain reliever and fever reducer',
    price: 45,
    mrp: 65,
    manufacturer: 'Bayer',
    stock: 350,
    rating: 4.6,
    reviewCount: 89,
    isEnabled: true,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5f3f2208f?w=400&h=400&fit=crop'],
    createdAt: '2024-02-15T10:00:00Z',
  },
];

// ─── Mock Orders ────────────────────────────────────

export const ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-001',
    buyerId: 'u1',
    buyerName: 'Pharma Plus Store',
    sellerId: 's1',
    sellerName: 'SunPharma Direct',
    status: 'DELIVERED',
    amount: 3500,
    total: 3500,
    items: [{ id: 'oi1', productId: 'p1', productName: 'Paracetamol 500mg', price: 35, quantity: 100, total: 3500 }],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'o2',
    orderNumber: 'ORD-002',
    buyerId: 'u1',
    buyerName: 'Pharma Plus Store',
    sellerId: 's1',
    sellerName: 'SunPharma Direct',
    status: 'SHIPPED',
    amount: 12000,
    total: 12000,
    items: [{ id: 'oi2', productId: 'p2', productName: 'Amoxicillin 250mg', price: 120, quantity: 100, total: 12000 }],
    createdAt: '2024-03-05T14:00:00Z',
  },
  {
    id: 'o3',
    orderNumber: 'ORD-003',
    buyerId: 'u1',
    buyerName: 'Pharma Plus Store',
    sellerId: 's1',
    sellerName: 'SunPharma Direct',
    status: 'PLACED',
    amount: 8000,
    total: 8000,
    items: [{ id: 'oi3', productId: 'p3', productName: 'Omeprazole 20mg', price: 80, quantity: 100, total: 8000 }],
    createdAt: '2024-03-10T09:30:00Z',
  },
];

// ─── Mock Inventory (low stock items for seller) ────

export const INVENTORY = [
  {
    productId: 'p1',
    productName: 'Paracetamol 500mg',
    sku: 'SKU-PARA-500',
    currentStock: 500,
    minStock: 50,
    unitCost: 25,
    lastRestocked: '2024-02-15T00:00:00Z',
    status: 'in_stock' as const,
  },
  {
    productId: 'p2',
    productName: 'Amoxicillin 250mg',
    sku: 'SKU-AMOX-250',
    currentStock: 15,
    minStock: 30,
    unitCost: 90,
    lastRestocked: '2024-01-20T00:00:00Z',
    status: 'low_stock' as const,
  },
  {
    productId: 'p3',
    productName: 'Omeprazole 20mg',
    sku: 'SKU-OMEP-020',
    currentStock: 0,
    minStock: 20,
    unitCost: 55,
    lastRestocked: '2024-01-05T00:00:00Z',
    status: 'out_of_stock' as const,
  },
];

// ─── Mock Payouts ───────────────────────────────────

export const PAYOUTS: Payout[] = [
  {
    id: 'pay1',
    sellerId: 's1',
    amount: 15000,
    status: 'PAID',
    method: 'Bank Transfer',
    reference: 'TXN-001',
    createdAt: '2024-02-28T10:00:00Z',
    paidAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'pay2',
    sellerId: 's1',
    amount: 32000,
    status: 'PENDING',
    method: 'Bank Transfer',
    createdAt: '2024-03-10T10:00:00Z',
  },
];

// ─── Chart Data ─────────────────────────────────────

export const CHART_DATA = [
  { month: 'Jan', revenue: 42000, orders: 28, buyers: 120, sellers: 18 },
  { month: 'Feb', revenue: 58000, orders: 35, buyers: 145, sellers: 22 },
  { month: 'Mar', revenue: 71000, orders: 42, buyers: 180, sellers: 27 },
  { month: 'Apr', revenue: 65000, orders: 38, buyers: 160, sellers: 24 },
  { month: 'May', revenue: 82000, orders: 51, buyers: 210, sellers: 31 },
  { month: 'Jun', revenue: 95000, orders: 62, buyers: 250, sellers: 38 },
];
