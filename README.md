# StockSphere

⚠️⚠️ Due to some conflict between smtp and resend, the authorization isn't working for now as it requires an otp. I am trying to look for a workaround that doesn't requires me investing, I am broke..
Multi-tenant inventory management platform for shop owners with optional public storefront discovery.

Built for businesses that are tired of managing stock through notebooks, memory, and ritual sacrifice.

Live URLs:

- Frontend: [https://stock-sphere-sable.vercel.app/](https://stock-sphere-sable.vercel.app/)
- Backend API: [https://stocksphere-4xt1.onrender.com/api](https://stocksphere-4xt1.onrender.com/api)

---

# Overview

StockSphere allows users to:

- Create one or more shops
- Manage inventory separately for each shop
- Track stock movement
- Receive low-stock alerts
- Search and filter products
- Make shops public or private
- Browse public shops/products
- Send business inquiries securely

---

# Key Features

## Private Inventory Management

- Product CRUD
- Category management
- SKU support
- Bulk stock add/remove
- Search / sort / filter
- Restock reminders

## Multi-Shop Support

- One user can manage multiple shops
- Separate inventory per shop
- Internal stock transfers (future)

## Public Marketplace

- Public shop listing
- Public product catalog
- Inquiry requests
- Consent-based contact sharing

## Security

- JWT authentication
- Role-based access control
- Tenant data isolation
- Password hashing

---

# Tech Stack

## Backend

- Java 17+
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven

## Database

- MySQL

## Frontend

- React
- Vite
- React Router
- React Toastify
- Custom CSS

## Tools

- Postman
- Git
- GitHub

---

# Architecture

Modular Monolith

Reason:

- Easier maintenance
- Faster development
- Cleaner than spaghetti disasters
- Scales reasonably for MVP

---

# Project Structure

```txt
stocksphere/
├── backend/
│   ├── auth/
│   ├── users/
│   ├── shops/
│   ├── inventory/
│   ├── inquiries/
│   └── notifications/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── services/
│
└── docs/
```

---

# Backend Setup

## Requirements

- Java 17+
- Maven
- MySQL

## Steps

1. Clone repository

```bash
git clone <repo-url>
```

2. Create database

```sql
CREATE DATABASE stocksphere;
```

3. Configure environment variables

Set these values in your environment or hosting dashboard:

- DB_HOST
- DB_PORT
- DB_NAME
- DB_USERNAME
- DB_PASSWORD
- JWT_SECRET
- JWT_EXPIRATION_MS
- CORS_ALLOWED_ORIGINS

4. Run backend

```bash
mvn spring-boot:run
```

Optional package command:

```bash
mvn clean package -DskipTests
```

## Backend Docker Deployment

Backend includes a Dockerfile at `backend/Dockerfile` for container deployment.

Build image:

```bash
cd backend
docker build -t stocksphere-backend .
```

Run container:

```bash
docker run -p 8080:8080 stocksphere-backend
```

---

# Frontend Setup

## Requirements

- Node.js 18+

## Steps

```bash
cd frontend
npm install
npm run dev
```

For production frontend deploy, set:

```env
VITE_API_BASE_URL=https://stocksphere-4xt1.onrender.com/api
```

## Dashboard Summary UI (Implemented)

- Frontend includes a dashboard cards page that calls `GET /api/dashboard/summary`
- Login/Register flow with token persistence is implemented
- Metrics shown:
	- Total Products
	- Low Stock Count
	- Inventory Value
	- Potential Revenue
	- Estimated Profit

## Product Management UI (Implemented)

- Route: `/products`
- Product table with columns for SKU, category, quantity, pricing, margin, and stock status
- Search by product name
- Category filter and low-stock toggle
- Add product modal
- Edit product modal
- Delete product with confirmation
- Quick stock actions: `+1`, `+5`, `-1`, `-5`

---

# API Base URL

```txt
http://localhost:8080/api
```

Production API Base URL:

```txt
https://stocksphere-4xt1.onrender.com/api
```

Production Frontend URL:

```txt
https://stock-sphere-sable.vercel.app/
```

---

# Current Backend Status (Implemented)

## Done

- Authentication with JWT
- JWT claims include `userId` and `role`
- Owner-scoped shop CRUD (create/list/update/delete)
- Product CRUD with owner checks
- Product stock patch endpoint
- Search/filter/sort for products
- Environment-variable based configuration for DB/JWT/CORS
- Docker deployment support

## Current Frontend Status (Implemented)

- Login/Register landing page at `/`
- Protected route flow for `/products`
- Session persistence with local storage and token expiry cleanup
- Current user bootstrap from `GET /api/auth/me`
- Auto logout on `401` / `403` API responses
- Toast notifications for success and error flows
- Shared loaders and empty states for polished UX

## Implemented API Snapshot

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Shops

- `POST /api/shops`
- `GET /api/shops`
- `PUT /api/shops/{id}`
- `DELETE /api/shops/{id}`

### Products

- `POST /api/products`
- `GET /api/products?shopId=...&search=...&category=...&lowStockOnly=...&sort=...`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `PATCH /api/products/{id}/stock`

### Dashboard

- `GET /api/dashboard/summary`

## Product Model

- `costPrice` and `sellingPrice` tracked separately
- `category` field added for filtering and analytics readiness
- `sort=profit` supported using per-unit margin

## Dashboard Summary Metrics

- `totalProducts`
- `lowStockCount`
- `inventoryValue`
- `potentialRevenue`
- `estimatedProfit`

---

# Initial Modules to Build

## Phase 1

- Authentication
- User profiles
- Shop creation
- Product CRUD

## Phase 2

- Search / filters
- Low stock alerts
- Staff roles

## Phase 3

- Public marketplace
- Inquiry flow

## Phase 4

- Analytics
- Reports
- Mobile support

---

# Example Use Cases

## Shop Owner

- Login
- Create Shop A
- Add products
- Update stock daily
- Get low stock alerts

## Multi-Branch Business

- Manage Shop A + Shop B
- Compare stock
- Transfer items later

## Buyer

- Browse public stores
- View available products
- Send inquiry

---

# Security Notes

- Never expose user data across tenants
- Validate all request input
- Use hashed passwords
- Use secure JWT secret
- Protect admin routes

---

# Future Enhancements

- Barcode scanner
- GST billing
- AI restock prediction
- WhatsApp integration
- Mobile app
- Export PDF/CSV reports

---

# Resume Impact

Built a multi-tenant SaaS inventory platform using Java Spring Boot, MySQL, JWT, and React, enabling secure multi-shop stock management with public B2B discovery features.

Useful sentence. Recruiters love nouns arranged professionally.

---

# License

MIT (or your choice)

---

# Author

@Mystify7777

Try not to break production on Friday evenings.
