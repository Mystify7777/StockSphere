# Project Variables & Constants

Central reference for environment variables, config values, enums, limits, and naming rules.

Use this file before hardcoding nonsense into five different places.

---

# Environment Variables

## Backend (`.env` or application.properties)

```env
APP_NAME=StockSphere
APP_ENV=development
SERVER_PORT=8080

DB_HOST=localhost
DB_PORT=3306
DB_NAME=stocksphere
DB_USERNAME=root
DB_PASSWORD=yourpassword

JWT_SECRET=change_this_to_long_random_secret
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

CORS_ALLOWED_ORIGINS=http://localhost:5173

LOG_LEVEL=INFO
```

---

# Frontend (`.env`)

```env
VITE_APP_NAME=StockSphere
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

---

# JWT Constants

| Variable                  | Value     | Meaning    |
| ------------------------- | --------- | ---------- |
| JWT_EXPIRATION_MS         | 900000    | 15 minutes |
| JWT_REFRESH_EXPIRATION_MS | 604800000 | 7 days     |

Recommended because users hate logging in repeatedly but attackers love permanent sessions.

---

# Roles

```txt
ROLE_OWNER
ROLE_STAFF
ROLE_ADMIN
ROLE_BUYER
```

## Meaning

- OWNER = Full shop control
- STAFF = Limited inventory access
- ADMIN = Platform admin
- BUYER = Marketplace browsing user

---

# Shop Visibility Enum

```txt
PRIVATE
PUBLIC
```

---

# Inquiry Status Enum

```txt
PENDING
ACCEPTED
REJECTED
CANCELLED
COMPLETED
```

---

# Product Status Enum

```txt
ACTIVE
OUT_OF_STOCK
DISCONTINUED
ARCHIVED
```

---

# Notification Types

```txt
LOW_STOCK
INQUIRY_RECEIVED
INQUIRY_ACCEPTED
TRANSFER_REQUEST
SYSTEM_ALERT
```

---

# Pagination Defaults

```txt
DEFAULT_PAGE=0
DEFAULT_SIZE=10
MAX_PAGE_SIZE=100
```

---

# Inventory Threshold Defaults

```txt
DEFAULT_LOW_STOCK_LIMIT=5
DEFAULT_CRITICAL_STOCK_LIMIT=1
```

Should be configurable per product later, because one screw and one refrigerator are not the same urgency.

---

# File Upload Limits

```txt
MAX_IMAGE_SIZE_MB=5
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp
```

---

# Naming Conventions

## Java Classes

```txt
PascalCase
UserService
ProductController
ShopRepository
```

## Variables

```txt
camelCase
shopId
productName
jwtToken
```

## Database Tables

```txt
snake_case
users
shops
shop_staff
stock_movements
```

## API Routes

```txt
kebab-case
/api/auth/login
/api/shops/{id}
/api/products/search
```

---

# Core API Prefix

```txt
/api
```

---

# Frontend Route Paths

```txt
/login
/register
/dashboard
/shops
/shops/:id
/inventory
/marketplace
/profile
/settings
```

---

# Date / Time Standards

```txt
Timezone: Asia/Kolkata
Storage: UTC preferred
Format: ISO-8601
```

---

# Currency Defaults

```txt
INR
₹
```

---

# Logging Format

```txt
[DATE TIME] LEVEL MODULE MESSAGE
```

Example:

```txt
2026-04-12 10:15:44 INFO AUTH User logged in
```

---

# Git Branch Strategy

```txt
main
develop
feature/auth-module
feature/inventory-api
bugfix/jwt-filter
```

---

# Reserved Slugs / Names

```txt
admin
api
login
register
root
system
support
```

Do not allow users to create shops named these as public URLs. Humans are inventive in the worst ways.

---

# Future Variables

- Redis host
- Email SMTP config
- SMS provider keys
- Cloud storage keys
- Payment gateway keys
