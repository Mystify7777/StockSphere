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

- [x] Create GitHub repository
- [x] Setup backend Spring Boot project
- [ ] Setup frontend React + Vite project
- [x] Create docs folder
- [ ] Create branch strategy

## Backend Core

- [x] Configure application.properties
- [ ] Connect MySQL database
- [x] Create global exception handler
- [x] Setup DTO structure
- [x] Setup response wrapper pattern

## Security

- [x] Add Spring Security
- [x] Implement JWT auth
- [x] Password hashing
- [x] Protected route middleware/filter
- [x] Role system setup

## Database Base Tables

- [x] users
- [x] roles
- [x] shops
- [x] products

---

# P1 - Important Tasks

## Auth Module

- [x] Register API
- [x] Login API
- [ ] Refresh token flow
- [ ] Logout API

## Shop Module

- [x] Create shop
- [x] Update shop
- [x] Delete shop
- [x] Public/private toggle
- [x] Multi-shop support

## Inventory Module

- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Search products
- [x] Filter low stock
- [x] Sort inventory

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

- [x] User
- [x] Role
- [x] Shop
- [x] Product
- [x] Category
- [ ] Inquiry
- [ ] Notification
- [ ] StockMovement

---

# API TODO

## Auth

- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [ ] POST /api/auth/refresh

## Shops

- [x] GET /api/shops
- [x] POST /api/shops
- [x] PUT /api/shops/{id}
- [x] DELETE /api/shops/{id}

## Products

- [x] GET /api/products
- [x] POST /api/products
- [x] PUT /api/products/{id}
- [x] DELETE /api/products/{id}

## Product Data Model

- [x] category field
- [x] costPrice field
- [x] sellingPrice field

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

- [x] Spring Boot init
- [ ] DB connect
- [x] JWT auth
- [x] User entity
- [x] Shop entity
- [x] Product entity

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
