**ShopNpay** is a modern, full-stack e-commerce application built with React and Vite. It focuses on providing a highly premium, aesthetic, and seamless shopping experience using advanced Framer Motion animations, glassmorphism UI, and a robust admin dashboard.
## ✨ Features
### For Customers 🛒
- **Premium UI/UX:** Smooth page transitions, scroll animations, and a dynamic hero section using `framer-motion`.
- **Advanced Product Catalog:** Real-time search, category filtering, price range sliders, and dynamic sorting.
- **Smart Pagination:** Cursor-based "Load More" functionality for seamless product browsing.
- **Cart & Wishlist:** Fully functional local and global state management for user cart and saved items.
- **Secure Authentication:** JWT-based login/signup with optimized token flow.
- **Checkout Integration:** Secure payment processing via Stripe.
- **Order Tracking:** Users can view their past orders and track current shipping status.
### For Administrators 🛡️
- **Admin Dashboard:** A dedicated, secure dashboard restricted to users with `admin` privileges.
- **Inventory Management:** Full CRUD operations for products (Add, Edit, Delete) with image uploads.
- **Order Fulfillment:** Track, update status (Processing, Shipped, Delivered), or cancel user orders.
- **User Management:** View registered users, assign roles (admin/user), and manage accounts.
## 🛠️ Tech Stack
- **Frontend Framework:** React 18+ (with Vite for extremely fast builds)
- **Styling:** Tailwind CSS (Custom themes, responsive design, glassmorphism)
- **Animations:** Framer Motion (Physics-based interactions, staggered reveals)
- **Routing:** React Router DOM
- **State Management:** React Context API & Custom Hooks
- **Payments:** Stripe (Stripe.js)
- **Notifications:** React Toastify 



## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/ehteysham10/ShopNpay-Frontend-.git
cd ShopNpay-Frontend-

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## 🔌 API Overview

The frontend connects to a custom REST API at `https://shopnpay-backend.onrender.com/api/v1`.

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/forgot-password`, `PATCH /auth/reset-password/:token` |
| Products | `GET /products`, `GET /products/:id` |
| Reviews | `GET /products/:id/reviews`, `POST /products/:id/reviews` |
| Cart | `GET /cart`, `POST /cart/:id`, `PATCH /cart/:id`, `DELETE /cart/:id` |
| Wishlist | `GET /wishlist`, `POST /wishlist/:id`, `DELETE /wishlist/:id` |
| Orders | `POST /orders/create-payment-intent`, `POST /orders/confirm`, `GET /orders/my-orders` |
| Admin | `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`, `GET /users`, `PATCH /users/:id/role` |

