# StockSphere

Multi-tenant inventory management platform for shop owners with optional public storefront discovery.

Built for businesses that are tired of managing stock through notebooks, memory, and ritual sacrifice.

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
- Tailwind CSS

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

Update:

```properties
application.yml
```

4. Run backend

```bash
mvn spring-boot:run
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

---

# API Base URL

```txt
http://localhost:8080/api
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
