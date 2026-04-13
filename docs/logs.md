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

---

## [2026-04-12] Auth Hardening

### Completed
- Removed duplicate properties config
- Consolidated to application.yml
- Added userId and role claims to JWT
- Improved token payload for frontend auth flow

### In Progress
- Runtime auth flow verification in Postman with fresh tokens

### Issues
- Maven still unavailable in terminal, so CLI compile/run checks remain blocked here

### Decisions
- Keep JWT payload lightweight but include identity and role claims for frontend bootstrap

### Next Steps
- Verify token payload values in login/register responses
- Start inventory movement auditing implementation

---

## [2026-04-12] Product Model Upgrade

### Completed
- Added category field
- Split price into costPrice and sellingPrice
- Prepared inventory for profit analytics
- Updated product create/update DTOs and response payload
- Added product category filter support
- Added `sort=profit` support based on per-unit margin

### In Progress
- Runtime verification with local database schema update (`ddl-auto=update`)

### Issues
- CLI startup verification remains blocked here until Maven is installed in terminal

### Decisions
- Introduced split pricing now to avoid frontend coupling with ambiguous single-price model

### Next Steps
- Add stock movement entity and audit writes for stock mutations
- Add paginated product listing response

---

## [2026-04-12] Dashboard Summary + Schema Cleanup

### Completed
- Added `GET /api/dashboard/summary`
- Added owner-scoped dashboard aggregation metrics:
  - totalProducts
  - lowStockCount
  - inventoryValue
  - potentialRevenue
  - estimatedProfit
- Added automatic legacy schema cleanup runner to drop `products.price` if it still exists

### In Progress
- Verifying dashboard response in Postman with real inventory data

### Issues
- mysql CLI not available in this terminal, so direct `DESCRIBE products` verification requires MySQL Workbench or local SQL client

### Decisions
- Keep dashboard summary aggregated across all shops owned by authenticated user

### Next Steps
- Add stock movement ledger with reason/before/after quantity
- Add pagination for product listing endpoint

---

## [2026-04-12] JWT Decode Fix + Dashboard Verification

### Completed
- Fixed JWT signing key fallback for non-Base64 secrets (`DecodingException` path)
- Verified end-to-end auth flow (`register -> token -> protected dashboard call`)
- Verified `GET /api/dashboard/summary` returns valid response shape

### In Progress
- Seeding products to validate non-zero dashboard metrics

### Issues
- Initial dashboard test failed due JWT key decode exception before fallback handling was widened

### Decisions
- Keep fallback to raw UTF-8 secret bytes when Base64 decode fails

### Next Steps
- Implement stock movement ledger and write entries on quantity change

---

## [2026-04-12] Seeded Summary Verification + Frontend Dashboard Cards

### Completed
- Seeded test owner, shop, and 5 products via real APIs
- Verified `GET /api/dashboard/summary` with non-zero realistic metrics:
  - totalProducts: 5
  - lowStockCount: 3
  - inventoryValue: 39336.00
  - potentialRevenue: 46845.00
  - estimatedProfit: 7509.00
- Scaffolded React + Vite frontend app
- Replaced starter UI with dashboard summary page and metric cards
- Added token-based summary fetch flow in frontend

### In Progress
- Hardening frontend auth/session flow (replace manual token paste)

### Issues
- Initial summary test was blocked by JWT Base64 decode handling; fixed in previous commit

### Decisions
- Prioritized demo-ready dashboard cards after validating backend metrics math

### Next Steps
- Build stock movement ledger backend module
- Add frontend login-to-dashboard token wiring

---

## [2026-04-12] Product Management UI Sprint

### Completed
- Added frontend route `/products`
- Added product API service layer for shops/products/dashboard endpoints
- Built product table with margin and stock-health status badges
- Added search input, category filter, low-stock toggle, and sort options
- Added add/edit product modal flow
- Added delete confirmation and quick stock adjustment buttons (`+1`, `+5`, `-1`, `-5`)
- Integrated stats row (total products, low stock, inventory value, expected profit)

### In Progress
- Token/session UX improvement (replace manual token paste with login screen)

### Issues
- None blocking in this sprint; production build succeeded

### Decisions
- Prioritized utility and interview-demo value over animation/theming extras

### Next Steps
- Build stock movement ledger backend module
- Connect frontend auth flow and persist session token

---

## [2026-04-12] Frontend Auth Persistence Sprint

### Completed
- Added persistent token storage helper using `localStorage`
- Added JWT-aware auth context with `login`, `logout`, `isAuthenticated`, and `loading`
- Added token expiry cleanup so expired sessions clear automatically
- Added protected route guard for `/products`
- Wrapped the React app in the auth provider at bootstrap
- Replaced the manual bearer-token shell with a session restore landing screen
- Switched product page data access to the shared auth context
- Verified frontend production build after the auth wiring

### In Progress
- 401 auto-logout handling from API responses
- Polished login-to-dashboard flow using real backend login form

### Issues
- None blocking; the auth layer compiles and the production build passes

### Decisions
- Keep auth persistence in a small shared context instead of pushing token state into individual pages

### Next Steps
- Add automatic logout on 401 responses
- Replace token paste flow with backend login UI when the sprint moves to UX polish

---

## [2026-04-12] User Bootstrap + 401 Auto Logout Sprint

### Completed
- Added current-user bootstrap from `GET /api/auth/me`
- Added user state to shared auth context
- Exposed `fetchCurrentUser` from auth context for session restore and login verification
- Wired the shell header to display the authenticated user name and role
- Added shared unauthorized handling in the frontend API client
- Auto-cleared sessions on `401` and `403` responses from API calls
- Verified the frontend production build after the auth trust-layer changes

### In Progress
- None blocking

### Issues
- None blocking; backend auth response shape was wrapped as expected

### Decisions
- Keep current-user bootstrap in the auth context so the whole app stays in sync after refresh and login

### Next Steps
- Add polished loaders, toasts, and empty states in the next sprint

---

## [2026-04-12] Toasts + Loaders + Empty States Sprint

### Completed
- Installed React Toastify and mounted a single app-wide ToastContainer
- Added shared loader and empty-state components
- Showed loading feedback during session restore, login, product fetch, and modal saves
- Added success toasts for login, product add/update/delete, and stock adjustments
- Added error toasts for inventory and login failures
- Replaced blank product waits with explicit empty states for no shops and no products
- Kept 401/403 auto-logout behavior and surfaced the expired-session toast
- Verified the frontend production build after the UI polish work

### In Progress
- None blocking

### Issues
- None blocking; the UI polish layer builds cleanly

### Decisions
- Keep toast and loader behavior centralized so future pages inherit the same feedback pattern

### Next Steps
- Move to deployment prep and environment hardening

---

## [2026-04-13] Deployment Prep + Public Auth UX Correction

### Completed
- Replaced hardcoded backend configuration with environment placeholders in backend `application.yml`
- Added CORS configuration wired to `CORS_ALLOWED_ORIGINS`
- Added backend Dockerfile for container deployment on Render
- Verified backend package build (`mvn clean package -DskipTests`)
- Confirmed frontend API base is env-driven via `VITE_API_BASE_URL`
- Switched public homepage from JWT debug restore screen to Login/Register flow
- Added credential-based auth integration using backend `/api/auth/login` and `/api/auth/register`
- Added route fallback redirect behavior for unknown frontend routes
- Polished auth landing UX for desktop/mobile and removed debug-facing public text
- Verified frontend production build after each UX/auth change

### In Progress
- Production smoke testing after frontend redeploy with live backend URL

### Issues
- Render runtime required Docker path for reliable Java deployment in this setup
- Public UX initially exposed a developer token recovery flow; corrected to user-facing onboarding

### Decisions
- Keep developer token tools out of public homepage
- Keep backend runtime config fully environment-driven for cloud portability
- Deploy order locked: backend first, frontend second

### Next Steps
- Redeploy frontend with `VITE_API_BASE_URL=https://stocksphere-4xt1.onrender.com/api`
- Execute live test flow: register, login, dashboard, products CRUD, logout, refresh

---

## [2026-04-13] Inter-Shop Stock Transfer Sprint

### Completed
- Added owner-scoped transfer endpoint: `POST /api/stock-transfers`
- Added transfer DTOs and response contracts
- Implemented transactional transfer service with strict ownership checks on both source and destination shops
- Enforced transfer validations:
  - `fromShopId != toShopId`
  - `quantity > 0`
  - source product exists under source shop ownership
  - source quantity is sufficient before transfer
- Implemented destination SKU merge logic:
  - add to existing destination product when SKU exists
  - create destination product copy when SKU is missing
- Added transfer audit movement types: `TRANSFER_OUT` and `TRANSFER_IN`
- Added dual movement writes per transfer for full traceability
- Added frontend transfer flow in products table with modal UX (`To Shop`, `Quantity`)
- Added transfer API client integration and post-transfer data refresh (products + activity panel)
- Added loading guard to prevent transfer double-submit (`Transferring...` state)
- Verified backend package build (`mvn clean package -DskipTests`)
- Verified frontend production build (`npm run build`)

### In Progress
- Manual smoke validation of transfer edge cases on live deployment

### Issues
- None blocking in build/compile stage; runtime smoke checks still pending

### Decisions
- Keep transfer as a dedicated module (`stocktransfer`) to avoid coupling with existing product CRUD endpoints
- Keep ownership validation at service layer for both shop IDs and source product lookup
- Keep transfer writes transactional so partial mutations cannot persist

### Next Steps
- Run live checklist:
  - transfer between two owned shops
  - verify source qty decreases
  - verify destination qty increases (or product created once)
  - verify no duplicate SKU product in destination
  - verify `TRANSFER_OUT` and `TRANSFER_IN` entries in activity logs
- Add integration tests for transfer success and failure scenarios
