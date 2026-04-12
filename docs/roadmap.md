# Product Roadmap

Strategic build plan for StockSphere.

Goal: ship a real usable product in stages instead of constructing a glorious unfinished monument to ambition.

---

# Current Status Snapshot (2026-04-13)

## Live Deployment

- Frontend: [https://stock-sphere-sable.vercel.app/](https://stock-sphere-sable.vercel.app/)
- Backend API: [https://stocksphere-4xt1.onrender.com/api](https://stocksphere-4xt1.onrender.com/api)

## Completed Recently

- Auth onboarding flow now uses Login/Register (no public JWT debug entry)
- Protected product route with session persistence and auto user bootstrap
- Auto-logout handling on unauthorized API responses
- Product management UX polish: toasts, loaders, empty states
- Backend environment-variable hardening for DB/JWT/CORS
- Backend containerization with Docker for Render deployment

## Current Focus

- Production smoke testing and stabilization
- Next feature wave: stock movement logs, staff access, low-stock notifications

---

# Development Philosophy

1. Build core utility first
2. Validate with real users
3. Expand only when pain points are proven
4. Keep architecture clean
5. Delay vanity features

---

# Timeline Overview

| Phase | Focus | Outcome |
|------|------|---------|
| Phase 0 | Foundation | Setup project & architecture |
| Phase 1 | MVP Core | Private inventory system live |
| Phase 2 | Business Features | Staff + alerts + reports |
| Phase 3 | Marketplace | Public shops + inquiries |
| Phase 4 | Scale & Polish | Performance + analytics |
| Phase 5 | Expansion | Mobile + AI + integrations |

---

# Phase 0: Foundation (Week 1)

## Goals

- Create repositories
- Setup backend + frontend
- Configure DB
- Base folder structure
- Security skeleton

## Deliverables

- Spring Boot app running
- React app running
- MySQL connected
- Environment configs
- Initial README/docs

## Exit Criteria

Project runs locally end-to-end.

---

# Phase 1: MVP Core Inventory (Weeks 2-4)

## Goals

Build something shop owners can use immediately.

## Modules

### Authentication

- Register
- Login
- JWT auth
- Logout
- Protected routes

### Shop Management

- Create shop
- Edit shop
- Multi-shop support

### Inventory

- Add product
- Edit product
- Delete product
- Quantity updates
- Search/filter/sort

## Deliverables

Usable private inventory platform.

## Exit Criteria

A user can manage stock daily without crying.

---

# Phase 2: Business Operations (Weeks 5-6)

## Goals

Make it practical for actual business workflows.

## Modules

### Alerts

- Low stock reminders
- Out-of-stock warnings

### Staff Access

- Invite staff
- Limited permissions
- Activity restrictions

### Logs

- Stock movement history
- User actions

### Reports

- Product summary
- Low stock report
- CSV export

## Exit Criteria

Owner can delegate work and monitor activity.

---

# Phase 3: Marketplace Layer (Weeks 7-9)

## Goals

Turn private shops into discoverable network.

## Modules

### Public Profiles

- Public/private toggle
- Shop page
- Public product listing

### Discovery

- Search shops
- Search products
- Filter by category/location

### Inquiry Flow

- Send inquiry
- Accept/reject request
- Reveal contact after consent

## Exit Criteria

Businesses can discover each other safely.

---

# Phase 4: Performance & Polish (Weeks 10-12)

## Goals

Improve reliability and user experience.

## Modules

### Backend

- Query optimization
- Pagination everywhere
- Indexing
- Better validation

### Frontend

- Responsive dashboard
- Better forms
- Loading states
- Empty states

### Security

- Rate limiting
- Token refresh flow
- Input sanitization

## Exit Criteria

Feels professional, not academic.

---

# Phase 5: Growth Features (Future)

## Mobile

- Android app
- Barcode scanning
- Push notifications

## Smart Features

- Demand forecasting
- AI reorder suggestions
- Sales insights

## Integrations

- WhatsApp
- Email
- GST billing
- Printer support

---

# Technical Milestones

## Backend Milestones

- Auth complete
- Multi-tenant access enforced
- Inventory APIs complete
- Marketplace APIs complete

## Frontend Milestones

- Dashboard complete
- Shop pages complete
- Marketplace UI complete

## Database Milestones

- Stable schema v1
- Index optimization
- Migration scripts

---

# Metrics to Track

## Product Metrics

- Registered users
- Shops created
- Products added
- Daily active users
- Public listings enabled

## Technical Metrics

- API response time
- Error rate
- DB query time
- Login success rate

Because feelings are not analytics.

---

# Release Strategy

## Internal Alpha

Use yourself / friends / local shops.

## Closed Beta

5-10 real businesses.

## Public Launch

Only after bugs stop breeding.

---

# Red Flags To Avoid

## Do Not Build Too Early

- AI chatbot
- Fancy charts nobody asked for
- Microservices circus
- 27 user roles
- Complex billing

## Do Build Early

- Fast product entry
- Search speed
- Reliable stock updates
- Clean auth
- Mobile responsive UI

---

# Recommended Weekly Routine

## Weekdays

- Build features

## Saturday

- Refactor + docs

## Sunday

- Testing + roadmap correction

Even software deserves reflection.

---

# Final Goal

Become the simplest serious inventory platform for small and medium shops.
