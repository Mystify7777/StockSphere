# Master TODO List

Primary execution list for StockSphere.

Rule:
- P0 = Critical
- P1 = Important
- P2 = Valuable
- P3 = Nice later

Do highest leverage work first, not whatever feels glamorous.

---

# CURRENT PHASE

Phase 0 -> Foundation Setup

---

# P0 - Critical Tasks

## Project Setup

- [ ] Create GitHub repository
- [ ] Setup backend Spring Boot project
- [ ] Setup frontend React + Vite project
- [ ] Create docs folder
- [ ] Create branch strategy

## Backend Core

- [ ] Configure application.properties
- [ ] Connect MySQL database
- [ ] Create global exception handler
- [ ] Setup DTO structure
- [ ] Setup response wrapper pattern

## Security

- [ ] Add Spring Security
- [ ] Implement JWT auth
- [ ] Password hashing
- [ ] Protected route middleware/filter
- [ ] Role system setup

## Database Base Tables

- [ ] users
- [ ] roles
- [ ] shops
- [ ] products

---

# P1 - Important Tasks

## Auth Module

- [ ] Register API
- [ ] Login API
- [ ] Refresh token flow
- [ ] Logout API

## Shop Module

- [ ] Create shop
- [ ] Update shop
- [ ] Delete shop
- [ ] Public/private toggle
- [ ] Multi-shop support

## Inventory Module

- [ ] Add product
- [ ] Edit product
- [ ] Delete product
- [ ] Search products
- [ ] Filter low stock
- [ ] Sort inventory

## Frontend Base

- [ ] Login page
- [ ] Register page
- [ ] Dashboard layout
- [ ] Navbar + sidebar
- [ ] Route protection

---

# P2 - Valuable Tasks

## Inventory Power Features

- [ ] Bulk stock add
- [ ] Bulk stock remove
- [ ] CSV import
- [ ] CSV export
- [ ] SKU auto-generation

## Notifications

- [ ] Low stock alerts
- [ ] In-app notifications
- [ ] Email alerts later

## Staff Access

- [ ] Invite staff
- [ ] Staff permissions
- [ ] Role restrictions

## Logs

- [ ] Stock movement history
- [ ] Audit trail

---

# P3 - Nice Later

## Marketplace

- [ ] Public shop directory
- [ ] Public products page
- [ ] Inquiry request flow
- [ ] Consent contact sharing

## Analytics

- [ ] Dashboard metrics
- [ ] Top selling products
- [ ] Dead stock report

## UX Polish

- [ ] Dark mode
- [ ] Better animations
- [ ] Skeleton loaders

Because modern apps must shimmer while failing.

---

# BACKEND ENTITY TODO

- [ ] User
- [ ] Role
- [ ] Shop
- [ ] Product
- [ ] Category
- [ ] Inquiry
- [ ] Notification
- [ ] StockMovement

---

# API TODO

## Auth

- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh

## Shops

- [ ] GET /api/shops
- [ ] POST /api/shops
- [ ] PUT /api/shops/{id}

## Products

- [ ] GET /api/products
- [ ] POST /api/products
- [ ] PUT /api/products/{id}
- [ ] DELETE /api/products/{id}

---

# FRONTEND TODO

## Pages

- [ ] Home
- [ ] Login
- [ ] Register
- [ ] Dashboard
- [ ] Shops
- [ ] Inventory
- [ ] Marketplace
- [ ] Settings

## Components

- [ ] Product table
- [ ] Add product modal
- [ ] Sidebar
- [ ] Search bar
- [ ] Stat cards

---

# TESTING TODO

- [ ] Postman auth tests
- [ ] Inventory CRUD tests
- [ ] Role permission tests
- [ ] Invalid token tests
- [ ] SQL edge case tests

---

# DEPLOYMENT TODO

- [ ] Backend deploy
- [ ] Frontend deploy
- [ ] Environment variables secure
- [ ] Production DB
- [ ] Domain setup

---

# WEEK 1 FOCUS ONLY

- [ ] Spring Boot init
- [ ] DB connect
- [ ] JWT auth
- [ ] User entity
- [ ] Shop entity
- [ ] Product entity

Ignore everything else until done. Shiny distractions are undefeated.

---

# WIN CONDITION

A real shop owner can:

- Login
- Create shop
- Add products
- Update stock
- Search inventory
- Use it daily

That is success. Not 600 unchecked tasks.
