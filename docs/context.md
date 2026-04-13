# Project Context

## Project Name
StockSphere (working title)

## One-Line Summary
A multi-tenant inventory management platform where each user can manage one or more shops privately, with optional public storefront discovery for B2B inquiries.

---

# Core Problem Being Solved

Small and medium shop owners often manage stock manually through notebooks, spreadsheets, memory, panic, superstition, and misplaced confidence.

They need:

- Fast inventory updates
- Multi-shop stock visibility
- Restock reminders
- Product search/filtering
- Staff access control
- Public product visibility (optional)
- Cross-shop inquiries

---

# Product Vision

Build a secure SaaS platform where:

- Every user owns their private data
- Users can create multiple shops
- Each shop has separate inventory
- Shops can optionally go public
- Other users can browse public products
- Contact exchange happens only with mutual consent

---

# Primary User Types

## 1. Shop Owner

Uses platform for:

- Inventory management
- Stock movement
- Public listings
- Staff control
- Reports

## 2. Staff Member

Uses platform for:

- Updating stock
- Viewing inventory
- Billing / sales entry (future)

Restricted permissions.

## 3. Buyer / Other Shop Owner

Uses platform for:

- Browse public shops
- View products
- Send inquiries

---

# Main Modules

## Module A: Authentication

- Register
- Login
- JWT auth
- Role management
- Password reset (later)

## Module B: Shop Management

- Create shop
- Update shop profile
- Activate / deactivate
- Public / private toggle

## Module C: Inventory

- Add product
- Edit product
- Delete product
- Bulk stock increase/decrease
- Inter-shop stock transfer (owner-owned shops only)
- Search / sort / filter

## Module D: Notifications

- Low stock alerts
- Inquiry received
- Transfer requests

## Module E: Marketplace

- Public shop directory
- Product browsing
- Inquiry requests
- Consent-based contact reveal

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
- Docker

---

# Live Deployment

- Frontend: https://stock-sphere-sable.vercel.app/
- Backend API: https://stocksphere-4xt1.onrender.com/api

---

# Architecture Style

Modular Monolith

Reason:

- Easier than microservices
- Faster development
- Clean separation possible
- Recruiter-friendly architecture

---

# Core Database Entities

- User
- Role
- Shop
- StaffAccess
- Product
- Category
- StockMovement
- Inquiry
- Notification

---

# Security Rules

- Users can only access owned shops
- Staff limited by permissions
- JWT secured APIs
- Password hashing
- Input validation
- SQL injection prevention via JPA

---

# Success Metrics

## MVP Success

- User can create shop
- Add products
- Update stock
- Receive low-stock alerts

## Growth Success

- Multiple businesses onboarded
- Public marketplace active
- Daily active usage

---

# Long-Term Extensions

- Barcode scanner
- Mobile app
- Analytics dashboard
- AI restock prediction
- WhatsApp integrations
- GST billing module

---

# Guiding Principles

1. Speed over decoration
2. Security over convenience
3. Simplicity over feature bloat
4. Mobile-first UX
5. Real business usefulness
