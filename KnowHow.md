# Sreenaya Stylescapes - Architecture & Module Documentation

**Last Updated:** May 24, 2026  
**Version:** 1.0  
**Status:** Shopify integration removed, Supabase-based architecture

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Module Breakdown](#module-breakdown)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Key Design Patterns](#key-design-patterns)
6. [Development Guide](#development-guide)
7. [Database Schema](#database-schema)

---

## System Architecture Overview

The Sreenaya Stylescapes application is built using a modern, component-driven frontend architecture with a Supabase backend. The application is organized into distinct layers:

### Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│          Frontend Layer (React + TypeScript)             │
│   (Routes, Components, Hooks, State Management)         │
├─────────────────────────────────────────────────────────┤
│         Business Logic Layer (Services & Utils)         │
│   (Catalog Service, Type Definitions, Error Handling)   │
├─────────────────────────────────────────────────────────┤
│            Data Access Layer (Supabase)                 │
│   (PostgreSQL Database, Real-time Subscriptions)        │
├─────────────────────────────────────────────────────────┤
│        Infrastructure (Vite, TanStack, Cloudflare)     │
│   (Dev Server, Router, Deployment)                      │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **React 19.2.0** - UI library with latest features
- **TypeScript 5.8** - Type-safe JavaScript
- **TanStack Start** - Full-stack React framework with file-based routing
- **TanStack React Router** - Type-safe routing
- **Zustand 5.0** - Lightweight state management
- **TailwindCSS 4.2** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend & Data
- **Supabase** - PostgreSQL database with real-time API
- **Vite 5.x** - Modern build tool and dev server
- **TypeScript** - End-to-end type safety

### Infrastructure
- **Cloudflare Workers** - Serverless deployment
- **localStorage** - Client-side cart persistence

### Removed
- ~~Shopify Storefront API~~ (Removed - replaced with Supabase catalog)

---

## Module Breakdown

### 1. Routes Layer (`src/routes/`)

The application uses TanStack Router with file-based routing. Each file represents a route.

#### **__root.tsx**
- **Purpose:** Root layout component that wraps all routes
- **Responsibilities:**
  - Renders main app shell with Navbar and Footer
  - Sets up error boundary (CatchBoundaryImpl)
  - Manages global error handling
  - Provides outlet for nested routes
- **Imports:** Navbar, Footer, error boundary utilities
- **Key Pattern:** Root layout composition pattern

#### **index.tsx**
- **Purpose:** Homepage / Products listing page
- **Responsibilities:**
  - Displays grid of products
  - Calls `getProducts()` to fetch from Supabase
  - Renders ProductCard components
  - Handles product selection and navigation
- **Data Flow:** Supabase → catalog service → component render
- **Error Handling:** Catches errors and displays fallback UI

#### **product.$handle.tsx**
- **Purpose:** Individual product detail page
- **Responsibilities:**
  - Displays single product with full details
  - Fetches product by slug using `getProductBySlug()`
  - Manages quantity selection
  - Handles "Add to Bag" functionality
  - Displays price, description, images
- **Route Params:** `handle` (product slug)
- **State Used:** `useCartStore()` for addItem action

#### **checkout.tsx**
- **Purpose:** Shopping cart review and checkout page
- **Responsibilities:**
  - Lists all cart items
  - Shows order summary
  - Manages checkout flow
  - Handles payment/order submission
- **Data Source:** `useCartStore()` - reads items from state

#### **about.tsx, contact.tsx**
- **Purpose:** Static information pages
- **Content:** Brand story, contact form
- **No special data dependencies**

---

### 2. Components Layer (`src/components/`)

#### **CartDrawer.tsx** ⭐
- **Purpose:** Sliding drawer showing shopping cart contents
- **Key Features:**
  - Uses Radix UI Sheet component for drawer UI
  - Displays all items from `cartStore.items`
  - Shows quantity controls (+/- buttons)
  - Displays item prices and totals
  - Checkout button navigates to `/checkout` route
  - Syncs cart on open
- **Props:** None (uses Zustand hook directly)
- **State:** `useCartStore()` → items, isLoading, isSyncing
- **Key Methods:**
  - `updateQuantity()` - modify item qty
  - `removeItem()` - delete item from cart
  - `getCheckoutUrl()` - returns checkout route
  - `syncCart()` - no-op for local storage
- **Fixed Issue:** Now uses `item.product.image_url` and `item.product.name` (was trying to access Shopify GraphQL structure)

#### **Navbar.tsx**
- **Purpose:** Top navigation bar
- **Features:**
  - Logo/brand link
  - Navigation links
  - CartDrawer trigger button with item count badge
- **Dependencies:** CartDrawer, useCartStore

#### **ProductCard.tsx**
- **Purpose:** Reusable product card component
- **Features:**
  - Displays product image, name, price
  - Link to product detail page
  - "Add to Bag" button
  - Hover effect on image
- **Props:** `{ product: Product }`
- **On Click:** Creates CartItem and calls `addItem()`
- **Image Source:** `product.image_url` from Supabase

#### **Footer.tsx**
- **Purpose:** Footer section
- **Content:** Links, copyright, contact info

#### **UI Components** (`src/components/ui/`)
- **badge.tsx** - Badge for item count
- **button.tsx** - Reusable button component
- **sheet.tsx** - Drawer/sheet component (from Radix UI)
- **sonner.tsx** - Toast notification setup

---

### 3. State Management (`src/stores/`)

#### **cartStore.ts** (Zustand)
- **Purpose:** Global shopping cart state
- **Architecture:** Zustand with localStorage persistence
- **Storage Key:** `sreenaya-cart`
- **Persisted Data:** Only `items` array (not cartId, checkoutUrl)

**State Interface:**
```typescript
interface CartStore {
  items: CartItem[]                    // Array of cart items
  cartId: string | null               // Reserved for future Supabase integration
  checkoutUrl: string | null          // Checkout URL
  isLoading: boolean                  // Loading state for async operations
  isSyncing: boolean                  // Cart sync status
  
  // Actions
  addItem(item): Promise<void>        // Add/update item
  updateQuantity(variantId, qty): Promise<void>
  removeItem(variantId): Promise<void>
  clearCart(): void                   // Empty cart
  syncCart(): Promise<void>           // Sync with server (no-op currently)
  getCheckoutUrl(): string | null     // Return checkout URL
}
```

**CartItem Structure:**
```typescript
interface CartItem {
  lineId: string | null               // For future Supabase compatibility
  product: Product                    // Full product object
  variantId: string                   // Using product.id as variant ID
  variantTitle: string                // "Default" for now
  price: { amount: string; currencyCode: string }
  quantity: number                    // Item quantity
  selectedOptions: Array<{ name: string; value: string }>  // Variant options
}
```

**Key Behaviors:**
- **Add Item:** Checks if item exists, updates qty or creates new entry
- **Remove:** Filters items by variantId
- **localStorage:** Auto-persists items on state changes
- **Sync:** Currently a no-op (reserved for future server sync)

---

### 4. Custom Hooks (`src/hooks/`)

#### **useCartSync.ts**
- **Purpose:** Synchronize cart state with server
- **Current Status:** Placeholder for future Supabase cart syncing
- **Planned Features:**
  - Sync cart to Supabase carts table
  - Handle multi-device cart consistency
  - Merge carts on login

---

### 5. Business Logic Layer (`src/lib/`)

#### **catalog.ts** ⭐
- **Purpose:** Product catalog service layer
- **Exported Functions:**

**`getProducts(limit: number = 24): Promise<Product[]>`**
- Fetches products from Supabase
- Parameters:
  - `limit` - max products to return
- Returns: Array of Product objects
- Query: `SELECT *, categories(*)`
- Ordering: `created_at DESC`

**`getProductBySlug(slug: string): Promise<Product | null>`**
- Fetches single product by slug
- Returns: Product object or null if not found
- Query: `.eq('slug', slug).single()`

**`getCategories(): Promise<Category[]>`**
- Fetches all product categories
- Ordered by name

**Error Handling:** All functions log errors to console and return empty arrays/null

#### **supabase.ts**
- **Purpose:** Initialize Supabase client
- **Configuration:**
  - URL: `VITE_SUPABASE_URL` env variable
  - Anon Key: `VITE_SUPABASE_ANON_KEY` env variable
- **Export:** `supabase` client instance
- **Usage:** Imported by catalog.ts for database queries

#### **types.ts** ⭐
- **Purpose:** Shared TypeScript interfaces

**Category Interface:**
```typescript
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}
```

**Product Interface:**
```typescript
interface Product {
  id: string
  category_id: string | null
  name: string                        // Product name
  slug: string                        // URL-friendly identifier
  description: string | null
  price: number                       // Price in cents/base units
  image_url: string | null            // Main product image
  in_stock: boolean                   // Stock status
  created_at: string                  // Timestamp
  categories?: Category               // Optional join data
  node?: any                          // Removed - was Shopify GraphQL
}
```

**Key Change:** Removed `node: any` Shopify GraphQL structure

#### **utils.ts**
- **Purpose:** Utility functions and helpers
- **Common Uses:** String formatting, date parsing, validation

#### **error-capture.ts**
- **Purpose:** Error tracking and logging
- **Features:** Capture errors for debugging

#### **error-page.ts**
- **Purpose:** Error page component
- **Features:** User-friendly error display with fallback UI

#### **sampleProduct.ts**
- **Purpose:** Sample/mock product data for testing
- **Usage:** Development and testing only

---

### 6. Hooks Layer (`src/hooks/`)

#### **useCartSync.ts**
```typescript
// Hook for syncing cart with Supabase
// Currently a placeholder
// Future implementation will:
// - Store cart in Supabase carts table
// - Sync across devices
// - Merge on user login
```

---

## Data Flow Diagrams

### Diagram Reference Guide

See `.draw.io/` directory for visual diagrams:

1. **01-architecture-overview.drawio**
   - Shows all layers: Frontend → Business Logic → Data → Infrastructure
   - Component groupings by type
   - External service integrations

2. **02-cart-dataflow.drawio**
   - "Add to Bag" flow → Zustand → localStorage
   - View cart flow → Reading items → Rendering
   - Modify quantity flow → Update → Re-render
   - Checkout flow

3. **03-product-catalog-flow.drawio**
   - Homepage product fetch flow
   - Product detail page flow
   - Product data structure

4. **04-module-dependencies.drawio**
   - Module import relationships
   - Component hierarchy
   - Service dependencies

---

## Key Design Patterns

### 1. **Store (Zustand) Pattern**
```typescript
const store = useCartStore()
// Direct state access without selectors (simpler)
const { items } = useCartStore()
```
- **Pros:** Minimal boilerplate, automatic re-renders on state changes
- **Cons:** Components re-render on any state change (can optimize with selectors)

### 2. **Service Layer Pattern**
```typescript
// catalog.ts abstracts Supabase queries
const products = await getProducts()
// Component doesn't need to know about Supabase
```
- Decouples UI from data source
- Easier to swap backends (e.g., REST API to GraphQL)

### 3. **Route-Component Binding**
```typescript
// TanStack Router with file-based routing
src/routes/product.$handle.tsx → /product/:handle
```
- Automatic route code-splitting
- Type-safe route parameters

### 4. **localStorage Persistence Pattern**
```typescript
// Zustand middleware auto-persists
persist(
  (set) => ({ /* state */ }),
  { storage: createJSONStorage(() => localStorage) }
)
```
- Survives browser refresh
- Offline cart support

---

## Development Guide

### Adding a New Product Feature

**Scenario:** Add a "favorites" feature to store liked products

**Steps:**

1. **Update Types** (`src/lib/types.ts`)
   ```typescript
   interface FavoriteItem {
     productId: string
     addedAt: string
   }
   ```

2. **Extend Store** (`src/stores/cartStore.ts`)
   ```typescript
   interface CartStore {
     // ... existing
     favorites: FavoriteItem[]
     addFavorite: (productId: string) => void
     removeFavorite: (productId: string) => void
   }
   ```

3. **Create Component Hook**
   ```typescript
   // src/hooks/useFavorites.ts
   export const useFavorites = () => {
     const { favorites, addFavorite, removeFavorite } = useCartStore()
     return { favorites, addFavorite, removeFavorite }
   }
   ```

4. **Update UI Components**
   ```typescript
   // ProductCard.tsx - add heart icon button
   const { favorites } = useFavorites()
   const isFavorited = favorites.some(f => f.productId === product.id)
   ```

5. **Add Route** (optional)
   ```typescript
   // src/routes/favorites.tsx
   // Display all favorited products
   ```

---

### Fetching Data from Supabase

**Pattern:**

```typescript
// In a route component
import { getProducts } from '@/lib/catalog'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts(24)
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
        // Show error to user
      }
    }
    loadProducts()
  }, [])
  
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

### Modifying Cart State

**Pattern:**

```typescript
import { useCartStore } from '@/stores/cartStore'

function MyComponent() {
  const addItem = useCartStore(s => s.addItem)
  
  const handleAddToCart = async (product: Product) => {
    await addItem({
      product,
      variantId: product.id,
      variantTitle: 'Default',
      price: { 
        amount: product.price.toString(), 
        currencyCode: 'USD' 
      },
      quantity: 1,
      selectedOptions: [],
    })
    // Toast notification follows in real code
  }
}
```

---

## Database Schema

### Tables (Supabase PostgreSQL)

#### **products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(512),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
)

CREATE INDEX idx_products_slug ON products(slug)
CREATE INDEX idx_products_category ON products(category_id)
```

#### **categories**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
)
```

#### **orders** (Planned)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
)
```

---

## Removed Shopify Integration

### What Was Removed

- **shopify.ts** - Shopify Storefront API client
- **ShopifyProduct Interface** - Shopify GraphQL response type
- **Shopify Constants** - API URL, token, API version
- **GraphQL Queries** - STOREFRONT_QUERY, PRODUCT_BY_HANDLE_QUERY
- **storefrontApiRequest** - Shopify API request function

### Why

- Supabase provides complete data management without 3rd-party APIs
- No Shopify subscription costs
- Full control over product catalog and pricing
- Simpler authentication (Supabase anon key vs Shopify token)
- Easier to implement features like variants and custom fields

### Migration Notes

If you need to re-integrate Shopify in the future:
1. Products need `node` structure for GraphQL responses
2. Use `product.node.images.edges[0].node.url` for images
3. Add back Shopify API constants and token management
4. Update CartItem to support Shopify variant IDs

---

## Environment Variables

Create `.env.local`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Common Tasks

### Debugging Cart Issues
1. Open DevTools → Application → localStorage
2. Look for `sreenaya-cart` key
3. Check stored items structure matches CartItem interface
4. Verify Zustand store actions are called correctly

### Testing Product Display
1. Verify Supabase connection: `supabase.from('products').select()`
2. Check images load: inspect image_url in browser
3. Confirm product slug matches URL parameter

### Performance Optimization
- Use Zustand selectors to prevent unnecessary re-renders
- Implement React.memo for ProductCard if lists are large
- Add pagination to getProducts() for large catalogs
- Cache product images with CDN

---

## Future Enhancements

- [ ] User authentication (Supabase Auth)
- [ ] Cart sync to database (useCartSync hook)
- [ ] Order history and management
- [ ] Product reviews and ratings
- [ ] Search and filtering
- [ ] Variant selection (colors, sizes)
- [ ] Wishlist/favorites
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Analytics tracking

---

**Document Version:** 1.0  
**Last Update:** May 24, 2026  
**Maintainer:** Development Team
