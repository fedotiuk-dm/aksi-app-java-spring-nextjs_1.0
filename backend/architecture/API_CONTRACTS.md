# API Контракти між доменами

## Загальні принципи

1. **RESTful API** - використання стандартних HTTP методів
2. **JSON Format** - всі запити та відповіді в JSON
3. **Versioning** - версіонування через URL (api/v1/)
4. **Error Handling** - стандартизовані помилки
5. **Authentication** - JWT токени в заголовку Authorization

## Стандартна структура помилок

```json
{
  "timestamp": "2024-01-30T10:15:30",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/orders",
  "errors": [
    {
      "field": "customerId",
      "message": "Customer not found"
    }
  ]
}
```

## Customer Domain API

### 1. Create Customer
```http
POST /api/v1/customers
Content-Type: application/json

{
  "firstName": "Іван",
  "lastName": "Петренко",
  "phone": "+380501234567",
  "email": "ivan@example.com",
  "address": {
    "street": "вул. Хрещатик",
    "building": "1",
    "apartment": "10",
    "city": "Київ",
    "postalCode": "01001"
  },
  "communicationPreferences": ["PHONE", "SMS"],
  "source": "INSTAGRAM"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Іван",
  "lastName": "Петренко",
  "phone": "+380501234567",
  "email": "ivan@example.com",
  "createdAt": "2024-01-30T10:15:30"
}
```

### 2. Search Customers
```http
GET /api/v1/customers/search?query=Петренко&phone=0501234567
Authorization: Bearer {token}

Response: 200 OK
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Іван",
      "lastName": "Петренко",
      "phone": "+380501234567",
      "email": "ivan@example.com"
    }
  ],
  "totalElements": 1
}
```

### 3. Get Customer Details
```http
GET /api/v1/customers/{customerId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Іван",
  "lastName": "Петренко",
  "phone": "+380501234567",
  "email": "ivan@example.com",
  "address": { ... },
  "communicationPreferences": ["PHONE", "SMS"],
  "source": "INSTAGRAM",
  "orderCount": 5,
  "totalSpent": 2500.00,
  "createdAt": "2024-01-30T10:15:30"
}
```

## Order Domain API

### 1. Create Order
```http
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "branchId": "660e8400-e29b-41d4-a716-446655440001",
  "uniqueLabel": "QR123456",
  "urgency": "NORMAL",
  "notes": "Обережно з пуговицями"
}

Response: 201 Created
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "orderNumber": "2024-001234",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "branchId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "CREATED",
  "createdAt": "2024-01-30T10:15:30",
  "estimatedCompletionDate": "2024-02-01T14:00:00"
}
```

### 2. Add Item to Order
```http
POST /api/v1/orders/{orderId}/items
Content-Type: application/json
Authorization: Bearer {token}

{
  "serviceId": "880e8400-e29b-41d4-a716-446655440003",
  "itemName": "Пальто жіноче",
  "quantity": 1,
  "unit": "PIECE",
  "characteristics": {
    "material": "WOOL",
    "color": "BLACK",
    "filler": null,
    "wearDegree": 30
  },
  "stains": ["GREASE", "COFFEE"],
  "defects": ["WORN_AREAS"],
  "modifiers": ["HAND_CLEANING", "URGENT"],
  "photos": [
    "base64_encoded_image_1",
    "base64_encoded_image_2"
  ]
}

Response: 201 Created
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "orderId": "770e8400-e29b-41d4-a716-446655440002",
  "serviceId": "880e8400-e29b-41d4-a716-446655440003",
  "itemName": "Пальто жіноче",
  "quantity": 1,
  "calculatedPrice": {
    "basePrice": 350.00,
    "modifiers": [
      {"name": "Ручна чистка", "amount": 70.00},
      {"name": "Термінова чистка", "amount": 175.00}
    ],
    "totalPrice": 595.00
  }
}
```

### 3. Get Order Details
```http
GET /api/v1/orders/{orderId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "orderNumber": "2024-001234",
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Іван Петренко",
    "phone": "+380501234567"
  },
  "branch": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Філія на Хрещатику"
  },
  "items": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "itemName": "Пальто жіноче",
      "service": "Чистка одягу",
      "quantity": 1,
      "price": 595.00
    }
  ],
  "totalAmount": 595.00,
  "discount": {
    "type": "SOCIAL_MEDIA",
    "percentage": 5,
    "amount": 29.75
  },
  "finalAmount": 565.25,
  "paidAmount": 300.00,
  "dueAmount": 265.25,
  "status": "IN_PROGRESS",
  "createdAt": "2024-01-30T10:15:30",
  "estimatedCompletionDate": "2024-02-01T14:00:00"
}
```

## Pricing Domain API

### 1. Calculate Price
```http
POST /api/v1/pricing/calculate
Content-Type: application/json
Authorization: Bearer {token}

{
  "serviceId": "880e8400-e29b-41d4-a716-446655440003",
  "quantity": 1,
  "characteristics": {
    "material": "WOOL",
    "color": "BLACK",
    "wearDegree": 30
  },
  "modifiers": ["HAND_CLEANING", "URGENT"],
  "discountType": "SOCIAL_MEDIA"
}

Response: 200 OK
{
  "basePrice": 350.00,
  "calculations": [
    {
      "step": "Base price for 'Пальто жіноче'",
      "amount": 350.00
    },
    {
      "step": "Hand cleaning (+20%)",
      "amount": 70.00
    },
    {
      "step": "Urgent service (+50%)",
      "amount": 175.00
    },
    {
      "step": "Social media discount (-5%)",
      "amount": -29.75
    }
  ],
  "subtotal": 595.00,
  "discount": 29.75,
  "total": 565.25
}
```

### 2. Get Price List
```http
GET /api/v1/pricing/pricelist?category=CLOTHING_CLEANING
Authorization: Bearer {token}

Response: 200 OK
{
  "category": "CLOTHING_CLEANING",
  "items": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "Пальто жіноче",
      "unit": "PIECE",
      "basePrice": 350.00,
      "blackColorPrice": 420.00
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440004",
      "name": "Костюм чоловічий",
      "unit": "PIECE",
      "basePrice": 280.00,
      "blackColorPrice": 336.00
    }
  ]
}
```

## Payment Domain API

### 1. Create Payment
```http
POST /api/v1/payments
Content-Type: application/json
Authorization: Bearer {token}

{
  "orderId": "770e8400-e29b-41d4-a716-446655440002",
  "amount": 300.00,
  "method": "CARD",
  "type": "PREPAYMENT"
}

Response: 201 Created
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "orderId": "770e8400-e29b-41d4-a716-446655440002",
  "amount": 300.00,
  "method": "CARD",
  "type": "PREPAYMENT",
  "status": "COMPLETED",
  "transactionId": "TRX123456789",
  "createdAt": "2024-01-30T10:15:30"
}
```

### 2. Get Payment History
```http
GET /api/v1/payments?orderId=770e8400-e29b-41d4-a716-446655440002
Authorization: Bearer {token}

Response: 200 OK
{
  "payments": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440005",
      "amount": 300.00,
      "method": "CARD",
      "type": "PREPAYMENT",
      "status": "COMPLETED",
      "createdAt": "2024-01-30T10:15:30"
    }
  ],
  "totalPaid": 300.00,
  "orderTotal": 565.25,
  "remainingAmount": 265.25
}
```

## Receipt Domain API

### 1. Generate Receipt
```http
POST /api/v1/receipts/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "orderId": "770e8400-e29b-41d4-a716-446655440002",
  "type": "ORDER_RECEIPT",
  "includeSignature": true
}

Response: 201 Created
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "orderId": "770e8400-e29b-41d4-a716-446655440002",
  "receiptNumber": "KV-2024-001234",
  "type": "ORDER_RECEIPT",
  "generatedAt": "2024-01-30T10:15:30",
  "pdfUrl": "/api/v1/receipts/bb0e8400-e29b-41d4-a716-446655440006/pdf",
  "qrCode": "data:image/png;base64,..."
}
```

### 2. Download Receipt PDF
```http
GET /api/v1/receipts/{receiptId}/pdf
Authorization: Bearer {token}

Response: 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="receipt_2024_001234.pdf"

[Binary PDF data]
```

## Notification Domain API

### 1. Send Notification
```http
POST /api/v1/notifications/send
Content-Type: application/json
Authorization: Bearer {token}

{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "ORDER_READY",
  "channels": ["SMS", "VIBER"],
  "templateData": {
    "orderNumber": "2024-001234",
    "branchName": "Філія на Хрещатику",
    "pickupTime": "після 14:00"
  }
}

Response: 202 Accepted
{
  "notificationId": "cc0e8400-e29b-41d4-a716-446655440007",
  "status": "QUEUED",
  "channels": [
    {
      "channel": "SMS",
      "status": "PENDING"
    },
    {
      "channel": "VIBER",
      "status": "PENDING"
    }
  ]
}
```

### 2. Get Notification Status
```http
GET /api/v1/notifications/{notificationId}/status
Authorization: Bearer {token}

Response: 200 OK
{
  "notificationId": "cc0e8400-e29b-41d4-a716-446655440007",
  "overallStatus": "DELIVERED",
  "channels": [
    {
      "channel": "SMS",
      "status": "DELIVERED",
      "deliveredAt": "2024-01-30T10:16:00"
    },
    {
      "channel": "VIBER",
      "status": "FAILED",
      "error": "User not found in Viber"
    }
  ]
}
```

## Service Domain API

### 1. Get Service Categories
```http
GET /api/v1/services/categories
Authorization: Bearer {token}

Response: 200 OK
{
  "categories": [
    {
      "id": "cat001",
      "code": "CLOTHING_CLEANING",
      "name": "Чистка одягу та текстилю",
      "description": "Професійна чистка всіх видів одягу"
    },
    {
      "id": "cat002",
      "code": "LAUNDRY",
      "name": "Прання білизни",
      "description": "Прання постільної білизни та текстилю"
    }
  ]
}
```

### 2. Get Services by Category
```http
GET /api/v1/services?categoryId=cat001
Authorization: Bearer {token}

Response: 200 OK
{
  "services": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "categoryId": "cat001",
      "name": "Пальто жіноче",
      "unit": "PIECE",
      "standardTerm": 48,
      "availableMaterials": ["WOOL", "SYNTHETIC", "COTTON"],
      "availableModifiers": ["HAND_CLEANING", "WATER_REPELLENT"]
    }
  ]
}
```

## Branch Domain API

### 1. Get All Branches
```http
GET /api/v1/branches
Authorization: Bearer {token}

Response: 200 OK
{
  "branches": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Філія на Хрещатику",
      "address": {
        "street": "вул. Хрещатик",
        "building": "22",
        "city": "Київ"
      },
      "phone": "+380441234567",
      "workSchedule": {
        "monday": "09:00-19:00",
        "tuesday": "09:00-19:00",
        "wednesday": "09:00-19:00",
        "thursday": "09:00-19:00",
        "friday": "09:00-19:00",
        "saturday": "10:00-17:00",
        "sunday": "closed"
      },
      "isActive": true
    }
  ]
}
```

## Event Contracts

### 1. OrderCreatedEvent
```json
{
  "eventId": "evt_123",
  "eventType": "ORDER_CREATED",
  "timestamp": "2024-01-30T10:15:30",
  "payload": {
    "orderId": "770e8400-e29b-41d4-a716-446655440002",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "branchId": "660e8400-e29b-41d4-a716-446655440001",
    "totalAmount": 565.25
  }
}
```

### 2. PaymentReceivedEvent
```json
{
  "eventId": "evt_124",
  "eventType": "PAYMENT_RECEIVED",
  "timestamp": "2024-01-30T10:15:30",
  "payload": {
    "paymentId": "aa0e8400-e29b-41d4-a716-446655440005",
    "orderId": "770e8400-e29b-41d4-a716-446655440002",
    "amount": 300.00,
    "method": "CARD"
  }
}
```

### 3. OrderReadyEvent
```json
{
  "eventId": "evt_125",
  "eventType": "ORDER_READY",
  "timestamp": "2024-02-01T14:00:00",
  "payload": {
    "orderId": "770e8400-e29b-41d4-a716-446655440002",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "branchId": "660e8400-e29b-41d4-a716-446655440001"
  }
}
```

## Pagination and Filtering

Всі endpoints що повертають списки підтримують:

```http
GET /api/v1/orders?page=0&size=20&sort=createdAt,desc&status=IN_PROGRESS&customerId=123

Response Headers:
X-Total-Count: 150
X-Page-Number: 0
X-Page-Size: 20
```

## Rate Limiting

```http
Response Headers:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706615730
```

## Health Checks

```http
GET /api/v1/actuator/health

Response: 200 OK
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "redis": {"status": "UP"},
    "customerService": {"status": "UP"},
    "pricingService": {"status": "UP"}
  }
}
```