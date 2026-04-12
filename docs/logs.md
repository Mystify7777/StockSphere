# Development Logs

Use this file as the official running journal of the project.

Purpose:

- Track progress
- Record bugs
- Store decisions
- Avoid repeating mistakes
- Document milestones

Because memory is unreliable and optimism is worse.

---

# Log Format Template

## [DATE] Title

### Completed
- item

### In Progress
- item

### Issues
- item

### Decisions
- item

### Next Steps
- item

---

# Logs

## [2026-04-12] Project Initialization

### Completed
- Finalized product direction as multi-tenant inventory platform
- Chosen backend stack:
  - Java
  - Spring Boot
  - MySQL
  - JWT
- Chosen frontend:
  - React + Vite + Tailwind
- Decided architecture: Modular Monolith
- Created documentation structure

### In Progress
- Planning backend folder structure
- Preparing database schema

### Issues
- None yet. Suspicious.

### Decisions
- Inventory system first
- Marketplace later
- Keep MVP lean

### Next Steps
- Define entities
- Create ER diagram
- Setup Spring Boot project

---

## [YYYY-MM-DD] Backend Bootstrap

### Completed
- Initialized Spring Boot app
- Added dependencies:
  - Spring Web
  - Spring Security
  - Spring Data JPA
  - MySQL Driver
  - Lombok
  - JWT library

### In Progress
- Configuring application.properties

### Issues
- Example issue here

### Decisions
- Use UUID ids

### Next Steps
- Build auth module

---

## [YYYY-MM-DD] Authentication Module

### Completed
- Register API
- Login API
- JWT generation
- Password hashing

### In Progress
- Refresh token flow

### Issues
- Token expiry confusion

### Decisions
- Access token short-lived
- Refresh token longer-lived

### Next Steps
- Secure protected routes

---

## [YYYY-MM-DD] Shop Module

### Completed
- Create shop
- Update shop
- Public/private toggle

### In Progress
- Shop logo upload

### Issues
- Owner validation edge cases

### Decisions
- One user can own many shops

### Next Steps
- Inventory module

---

## [YYYY-MM-DD] Inventory Module

### Completed
- Add product
- Edit product
- Delete product
- Search by name
- Low stock filter

### In Progress
- Bulk stock updates

### Issues
- Quantity race conditions

### Decisions
- Use stock movement logs

### Next Steps
- Alerts system

---

## [YYYY-MM-DD] Marketplace Module

### Completed
- Public shop listing
- Product browse page

### In Progress
- Inquiry request flow

### Issues
- Spam prevention needed

### Decisions
- Contact details hidden until consent

### Next Steps
- Notifications

---

# Bug Log Section

## Critical Bugs

| Date | Bug | Status |
|------|-----|--------|
| - | - | - |

---

# Performance Notes

- Add DB indexes on:
  - email
  - shop_id
  - sku
  - product_name

- Cache dashboard later

---

# Lessons Learned

Write painful mistakes here so future-you stops behaving like current-you.

---

## [2026-04-12] Backend Auth + Shop Bootstrap (Executed)

### Completed
- Added backend package structure: config, auth, user, shop, common
- Added JWT dependencies and security configuration
- Implemented `User` entity with UUID id and role enum
- Implemented auth APIs:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Implemented `Shop` entity (owner relation) and create/list APIs:
  - `POST /api/shops`
  - `GET /api/shops`
- Added global API response wrapper and exception handler
- Added health endpoint `GET /api/health`

### In Progress
- Local runtime verification with Maven
- MySQL instance setup for integration testing

### Issues
- Maven is not installed on current terminal (`mvn` command not found), so compile/run could not be validated via CLI yet.

### Decisions
- Use UUID primary keys for user and shop from day one
- Keep auth stateless with JWT and Spring Security filter chain
- Enforce ownership scoping at service/repository boundary for shops

### Next Steps
- Install Maven and run compile + boot test
- Add product entity and product CRUD for inventory module
- Add ownership checks for update/delete shop endpoints

---

## [2026-04-12] Inventory Module API (Phase Progress)

### Completed
- Added `Product` domain with UUID id and shop relationship
- Added `ProductStatus` enum and low-stock-aware status updates
- Implemented product APIs:
  - `POST /api/products`
  - `GET /api/products?shopId=...&search=...&lowStockOnly=...&sort=...`
  - `PUT /api/products/{id}`
  - `DELETE /api/products/{id}`
  - `PATCH /api/products/{id}/stock`
- Enforced owner access checks for product operations via owner-scoped repository methods
- Added owner-scoped shop lookup helper (`findByIdAndOwnerEmail`) for secure product creation

### In Progress
- Runtime verification with local MySQL and Maven

### Issues
- Terminal still lacks Maven (`mvn` unavailable), so CLI compile/run is pending

### Decisions
- Keep search/filter/sort in service layer for current phase speed
- Use delta-based stock patch endpoint for frequent stock operations

### Next Steps
- Implement shop update/delete APIs with strict ownership
- Add stock movement table and audit entries for stock changes
- Add pagination defaults for product listing endpoint

---

## [2026-04-12] Shop CRUD Ownership Hardening

### Completed
- Added `PUT /api/shops/{id}` for owner-scoped shop updates
- Added `DELETE /api/shops/{id}` for owner-scoped shop deletion
- Added `UpdateShopRequest` DTO for validated updates
- Kept public/private toggle in update flow (`publicStatus`)
- Preserved owner authorization checks through `findByIdAndOwnerEmail`

### In Progress
- Product listing pagination and stock movement auditing

### Issues
- CLI Maven validation still blocked until Maven is available in terminal

### Decisions
- Keep shop visibility toggle inside shop update endpoint for now

### Next Steps
- Add stock movement entity and log writes on stock changes
- Add pagination parameters to product listing
