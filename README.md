# 🛒 ShopEZ – MERN E-Commerce Platform

ShopEZ is a full-stack MERN E-Commerce application that provides a complete online shopping experience. Customers can browse products, add items to their cart or wishlist, place orders, and track purchases. Sellers can manage their inventory, while administrators have complete control over users, products, categories, and orders.

---

# 📌 Features

## 👤 Customer

- User Registration & Login (JWT Authentication)
- Browse Products
- Search Products
- Filter Products by Category & Price
- Product Details
- Add to Cart
- Update Cart Quantity
- Remove Items from Cart
- Wishlist Management
- Buy Now
- Order History
- User Profile

---

## 🛍 Seller

- Seller Dashboard
- Add Products
- Update Products
- Delete Products
- Manage Inventory
- View Orders

---

## 👨‍💼 Admin

- Admin Dashboard
- Manage Users
- Manage Categories
- Manage Products
- Manage Orders
- Update Order Status
- View Reports

---

# 🚀 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS Modules
- Context API

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Multer
- CORS

## Database

- MongoDB
- Mongoose



# 🗄 Database Collections

- Users
- Products
- Categories
- Cart
- Wishlist
- Orders
- Payments

---

# 🔐 Authentication

- JWT Token Authentication
- Protected Routes
- Role-Based Authorization
- Customer
- Seller
- Admin

---

# ⚙ Installation

## Backend Setup

```bash
cd server
```

Install Dependencies

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
```

Install Dependencies

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

# 🌐 API Modules

## Authentication

- Register
- Login
- Profile

## Categories

- Create Category
- Get Categories
- Update Category
- Delete Category

## Products

- Create Product
- Get Products
- Get Product By ID
- Update Product
- Delete Product

## Cart

- Add Item
- Update Quantity
- Remove Item
- Clear Cart

## Wishlist

- Add Product
- Remove Product
- Get Wishlist

## Orders

- Create Order
- Buy Now
- My Orders
- Order Details
- Cancel Order
- Update Status

## Payments

- Payment Methods
- Payment Status
- COD Support

# 📈 Future Enhancements

- Razorpay Integration
- Stripe Integration
- Product Reviews
- Ratings
- Coupons
- Notifications
- Email Verification
- Forgot Password
- Address Book
- Multiple Shipping Addresses
- Order Tracking
- Invoice Generation
- Analytics Dashboard


---

# 🛡 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected APIs
- Role-Based Authorization
- Input Validation
- Error Handling


