---

## REST API Catalog

**File:** `Y1-api.md`  
**Owned by:** F07 (REST API & Data Persistence)  
**Consumed by:** F01 (menu), F04 (orders)

---

### Base URL

- **Development:** `http://localhost:3000`
- **Production:** Same origin as the frontend (Express serves both at `http://0.0.0.0:3000`)

### Common Response Envelope

Every endpoint returns this top-level shape:

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

interface ApiError {
  code: string;       // SCREAMING_SNAKE_CASE error identifier
  message: string;    // Human-readable description
  field?: string;     // Present on validation errors; names the offending field
}
```

### Common HTTP Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

---

## Endpoints

---

### GET /api/menu

Returns all available menu items sorted by category and sort_order.

**Request**

```
GET /api/menu
```

No query parameters, no request body.

**Response 200 OK**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Flat White",
      "description": "Velvety microfoam over a double ristretto. The barista's choice.",
      "basePrice": 5.50,
      "category": "Espresso",
      "drinkType": "espresso",
      "hasCustomizations": true,
      "available": true,
      "sortOrder": 10,
      "options": {
        "sizes": [
          { "label": "Small",  "delta": -0.50 },
          { "label": "Medium", "delta":  0.00 },
          { "label": "Large",  "delta":  0.75 }
        ],
        "milks": ["Whole", "Oat", "Almond", "Coconut", "Skim", "None"],
        "temperatures": ["Hot", "Iced"],
        "shots": ["Single", "Double", "Triple"],
        "extras": [
          { "label": "Vanilla Syrup",  "price": 0.75 },
          { "label": "Caramel",        "price": 0.75 },
          { "label": "Hazelnut",       "price": 0.75 },
          { "label": "Extra Shot",     "price": 1.00 },
          { "label": "Whipped Cream",  "price": 0.50 }
        ]
      },
      "createdAt": "2026-06-15T00:00:00.000Z"
    }
    // ... 19–29 more items
  ],
  "error": null,
  "status": 200
}
```

**Response field mapping (DB column → JSON key):**

| DB Column | JSON Key |
|-----------|----------|
| `id` | `id` |
| `name` | `name` |
| `description` | `description` |
| `base_price` | `basePrice` |
| `category` | `category` |
| `drink_type` | `drinkType` |
| `has_customizations` | `hasCustomizations` (boolean) |
| `available` | `available` (boolean) |
| `sort_order` | `sortOrder` |
| `options_json` (parsed) | `options` |
| `created_at` | `createdAt` |

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| Database read error | 500 | `DB_READ_ERROR` |

---

### GET /api/menu/categories

Returns the list of distinct category names for available items, sorted alphabetically.

**Request**

```
GET /api/menu/categories
```

No query parameters, no request body.

**Response 200 OK**

```json
{
  "data": ["Cold Brew", "Espresso", "Pour-Over", "Seasonal", "Tea"],
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| Database read error | 500 | `DB_READ_ERROR` |

---

### GET /api/menu/:id

Returns a single menu item by its database ID, with full customization options.

**Request**

```
GET /api/menu/3
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | Menu item database ID |

**Response 200 OK**

```json
{
  "data": {
    "id": 3,
    "name": "Oat Milk Latte",
    "description": "Silky oat milk and a double shot. Our most-ordered drink.",
    "basePrice": 6.00,
    "category": "Espresso",
    "drinkType": "espresso",
    "hasCustomizations": true,
    "available": true,
    "sortOrder": 30,
    "options": {
      "sizes": [
        { "label": "Small",  "delta": -0.50 },
        { "label": "Medium", "delta":  0.00 },
        { "label": "Large",  "delta":  0.75 }
      ],
      "milks": ["Whole", "Oat", "Almond", "Coconut", "Skim", "None"],
      "temperatures": ["Hot", "Iced"],
      "shots": ["Single", "Double", "Triple"],
      "extras": [
        { "label": "Vanilla Syrup",  "price": 0.75 },
        { "label": "Caramel",        "price": 0.75 },
        { "label": "Hazelnut",       "price": 0.75 },
        { "label": "Extra Shot",     "price": 1.00 },
        { "label": "Whipped Cream",  "price": 0.50 }
      ]
    },
    "createdAt": "2026-06-15T00:00:00.000Z"
  },
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| `id` is not a positive integer | 400 | `INVALID_ID` |
| Item not found or `available = 0` | 404 | `ITEM_NOT_FOUND` |
| Database read error | 500 | `DB_READ_ERROR` |

---

### POST /api/orders

Submits a new order. Persists the order and all line items atomically in a single SQLite transaction. Returns the created order with its reference number.

**Request**

```
POST /api/orders
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": [
    {
      "menuItemId": 3,
      "name": "Oat Milk Latte",
      "unitPrice": 6.75,
      "quantity": 2,
      "customizations": {
        "size": "Large",
        "milk": "Oat",
        "temperature": "Iced",
        "shots": "Double",
        "addons": ["Vanilla Syrup"],
        "specialInstructions": "Extra hot please"
      }
    },
    {
      "menuItemId": 7,
      "name": "Nitro Cold Brew",
      "unitPrice": 5.75,
      "quantity": 1,
      "customizations": {
        "size": "Medium",
        "milk": "None",
        "temperature": "Iced",
        "shots": null,
        "addons": [],
        "specialInstructions": ""
      }
    }
  ],
  "subtotal": 19.25,
  "notes": ""
}
```

**Request Body Field Validation:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `items` | array | Yes | Non-empty; max 50 line items |
| `items[].menuItemId` | integer | Yes | > 0 |
| `items[].name` | string | Yes | 1–200 chars |
| `items[].unitPrice` | number | Yes | > 0; rounded to 2dp |
| `items[].quantity` | integer | Yes | 1–10 |
| `items[].customizations` | object | Yes | Must be present |
| `items[].customizations.size` | string | Yes | 1–50 chars |
| `items[].customizations.milk` | string\|null | No | Max 50 chars |
| `items[].customizations.temperature` | string\|null | No | Max 50 chars |
| `items[].customizations.shots` | string\|null | No | Max 20 chars |
| `items[].customizations.addons` | string[] | No | Max 10 items; each max 100 chars |
| `items[].customizations.specialInstructions` | string | No | Max 200 chars |
| `subtotal` | number | Yes | > 0 |
| `notes` | string | No | Max 500 chars; empty string accepted |

**Response 201 Created**

```json
{
  "data": {
    "orderId": 42,
    "orderReference": "BRW-00042",
    "createdAt": "2026-06-15T14:32:00.000Z",
    "subtotal": 19.25,
    "status": "received",
    "items": [
      {
        "id": 83,
        "menuItemId": 3,
        "name": "Oat Milk Latte",
        "unitPrice": 6.75,
        "quantity": 2,
        "customizations": {
          "size": "Large",
          "milk": "Oat",
          "temperature": "Iced",
          "shots": "Double",
          "addons": ["Vanilla Syrup"],
          "specialInstructions": "Extra hot please"
        }
      },
      {
        "id": 84,
        "menuItemId": 7,
        "name": "Nitro Cold Brew",
        "unitPrice": 5.75,
        "quantity": 1,
        "customizations": {
          "size": "Medium",
          "milk": "None",
          "temperature": "Iced",
          "shots": null,
          "addons": [],
          "specialInstructions": ""
        }
      }
    ]
  },
  "error": null,
  "status": 201
}
```

**Error Responses:**

| Condition | Status | Error Code | Notes |
|-----------|--------|------------|-------|
| `items` is empty or missing | 400 | `EMPTY_ORDER` | — |
| Required field missing | 400 | `INVALID_PAYLOAD` | `field` key names the missing field |
| Field fails validation | 400 | `INVALID_PAYLOAD` | `field` key names the invalid field |
| SQLite transaction error | 500 | `DB_WRITE_ERROR` | Transaction is rolled back |

---

### GET /api/orders/:id

Retrieves a stored order by its database ID. Intended for the confirmation screen and future extensibility.

**Request**

```
GET /api/orders/42
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | Order database ID |

**Response 200 OK**

```json
{
  "data": {
    "orderId": 42,
    "orderReference": "BRW-00042",
    "createdAt": "2026-06-15T14:32:00.000Z",
    "subtotal": 19.25,
    "status": "received",
    "notes": "",
    "items": [
      {
        "id": 83,
        "menuItemId": 3,
        "name": "Oat Milk Latte",
        "unitPrice": 6.75,
        "quantity": 2,
        "customizations": {
          "size": "Large",
          "milk": "Oat",
          "temperature": "Iced",
          "shots": "Double",
          "addons": ["Vanilla Syrup"],
          "specialInstructions": "Extra hot please"
        }
      }
    ]
  },
  "error": null,
  "status": 200
}
```

**Error Responses:**

| Condition | Status | Error Code |
|-----------|--------|------------|
| `id` is not a positive integer | 400 | `INVALID_ID` |
| Order not found | 404 | `ORDER_NOT_FOUND` |
| Database read error | 500 | `DB_READ_ERROR` |

---

### Endpoint Summary

| Method | Path | Feature | Purpose | Auth Required |
|--------|------|---------|---------|---------------|
| `GET` | `/api/menu` | F01, F07 | Fetch full menu | None |
| `GET` | `/api/menu/categories` | F01, F07 | Fetch category list | None |
| `GET` | `/api/menu/:id` | F02, F07 | Fetch single item | None |
| `POST` | `/api/orders` | F04, F07 | Create new order | None |
| `GET` | `/api/orders/:id` | F04, F07 | Retrieve order | None |

---
