# DealFlow360 - Intelligent, Self-Governing Sales Operations Platform

DealFlow360 is a full-featured B2B Sales Operations Platform designed to manage multi-tier discount governance, real-time margin and upsell recommendations, multi-warehouse fulfillment splitting, hybrid subscription billing with mid-cycle proration, interactive customer portal negotiations, and deal health anomaly monitoring.

## Tech Stack & Architecture

- **Architecture**: MERN Stack with Modular Service Engine pattern (`Route -> Controller -> Service Engine -> Model -> MongoDB`)
- **Frontend**: React + Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Folder Structure

```text
dealflow360/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # ui, layout, forms, common
│   │   ├── pages/               # auth, dashboard, products, customers, quotations, approvals, warehouses, subscriptions, customer-portal
│   │   ├── features/            # quotation, discount, upsell, fulfillment, billing
│   │   ├── services/            # api.js
│   │   ├── hooks/
│   │   ├── context/             # AuthContext
│   │   ├── routes/              # ProtectedRoute, RoleRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/              # db.js, env.js
│   │   ├── models/              # User, Customer, Product, Warehouse, Quotation, etc.
│   │   ├── controllers/         # authController, quotationController, etc.
│   │   ├── services/            # discountEngine, approvalEngine, marginEngine, upsellEngine, warehouseEngine, billingEngine
│   │   ├── routes/              # authRoutes, quotationRoutes, etc.
│   │   ├── middleware/          # auth, role, errorHandler
│   │   ├── seed/
│   │   └── app.js
│   └── package.json
│
├── .env
├── .gitignore
├── README.md
└── package.json
```

## Getting Started

### Installation
```bash
npm run install:all
```

### Running Development Servers
```bash
npm run dev
```
