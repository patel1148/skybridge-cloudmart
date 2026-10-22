# SkyBridge CloudMart ☁️🛒
### Enterprise Cloud Marketplace & Multi-Cloud Services Portal

[![Azure App Service](https://img.shields.io/badge/Azure%20App%20Service-P1v3%20Linux-0078D4?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Azure SQL Serverless](https://img.shields.io/badge/Azure%20SQL-Serverless%20Gen5-0089D6?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20%20LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![CI/CD Pipeline](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

---

## 1. Project Overview

**SkyBridge CloudMart** is a production-grade, resilient enterprise cloud services marketplace engineered for **SkyBridge Tech Innovations Ltd.** (Directors: Elena Torres & Michael Grant). Developed for **Auckland Institute of Studies (AIS)** under **SOFT807: Cloud Applications Development (Assessment 1)**, this platform showcases high-availability cloud architecture, zero-trust network integration, and automated CI/CD deployment pipelines.

The platform provides an end-to-end e-commerce interface where enterprise clients can browse, configure, and purchase cloud security audits, CI/CD automated pipelines, and BI analytics clusters.

---

## 2. System Architecture & Dual-Engine Persistence

To guarantee **100% zero-crash uptime** during transient cloud outages or Azure SQL Serverless cold-starts (auto-pause wakeups), SkyBridge CloudMart utilizes an intelligent **Dual-Engine Persistence Layer**:

```
                       [ CLIENT BROWSER (HTTPS) ]
                                   │
                                   ▼
                   [ AZURE APP SERVICE (Node.js 20 LTS) ]
                   │  - Express REST API Engine         │
                   │  - Static Asset Glassmorphism Web  │
                   └───────────────┬────────────────────┘
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                     ▼
     [ PRIMARY DATASTORE ]                 [ RESILIENT FALLBACK ]
     Microsoft Azure SQL                   In-Memory Synchronized
     Database Serverless                   State Mirror (Fail-safe)
     (TDS Port 1433)                       (Zero 500 Downtime)
```

1. **Primary Store:** Microsoft Azure SQL Database Serverless (`General Purpose Gen5`, 1.0–4.0 vCores, 60-minute auto-pause delay).
2. **Resilience Mirror:** In-memory transactional fallback that mirrors data mutations in real-time. If the Azure SQL connection encounters a network timeout or pause delay, read/write requests seamlessly continue with zero HTTP 500 errors.

---

## 3. Key Functional Features

- **Role-Based Authentication (RBAC):**
  - **Customer Role:** Secure registration with regex password validation, catalog browsing, shopping cart addition, quantity updates, and checkout simulation.
  - **Administrator Role:** Elevated access to the Cloud CMS dashboard, product creation, real-time pricing updates, and inventory deletion.
- **Dynamic Cart & Checkout:**
  - Real-time client and server recalculation of line totals, New Zealand GST (15%), enterprise discounts, and grand totals.
- **Health Telemetry Endpoint:**
  - Dedicated `/api/status` endpoint exposing active database engine, latency benchmarks, and system uptime.
- **Modern Glassmorphic UI:**
  - Responsive dark-slate aesthetics tailored with CSS3 custom properties, CSS Grid, Flexbox, and micro-animations.

---

## 4. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript, jQuery, Font Awesome 6, Google Fonts (Inter / Outfit) |
| **Backend API** | Node.js (v20+ LTS), Express.js 4.19, CORS middleware |
| **Database** | Microsoft Azure SQL (`mssql` driver with connection pooling and auto-reconnect) |
| **Cloud Hosting (PaaS)**| Azure App Service (`asp-skybridge-linux-prod`, SKU: Premium P1v3) |
| **Networking & Security**| Azure VNet (`10.0.0.0/16`), Subnet delegation, Azure Bastion, Network Security Groups |
| **CI/CD Automation** | GitHub Actions (`.github/workflows/azure-webapp-cicd.yml`) |
| **Secondary Cloud** | Render Cloud Application Platform (`render.yaml`, Dockerfile) |

---

## 5. Environment Variables & Configuration

Configure the following environment variables in your deployment environment (or via Azure App Service Configuration / `.env`):

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | HTTP Server Port | `3000` (Local) / `8080` (Azure) |
| `AZURE_SQL_ENABLED` | Toggle Azure SQL connection | `true` |
| `DB_SERVER` | Azure SQL Logical Server FQDN | `sqlserver-skybridge-jay2026.database.windows.net` |
| `DB_NAME` | Target Database Name | `sqldb-skybridge-bi` |
| `DB_USER` | SQL Administrator Username | `cloudadmin` |
| `DB_PASSWORD` | SQL Administrator Password | `SkyBridge2026!` |
| `DB_PORT` | SQL TDS Port | `1433` |
| `NODE_ENV` | Application Environment | `production` |

---

## 6. Local Development Quickstart

### Prerequisites
- Node.js (v18.x or v20.x LTS)
- Git

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/skybridge-cloudmart.git
cd skybridge-cloudmart

# 2. Install dependencies
npm install

# 3. Start the application
npm start
```

Open your browser and navigate to: **`http://localhost:3000`**

### Default Test Credentials:
- **Administrator:** `admin@skybridge.com` / `AdminPass2026!`
- **Customer:** `jay.kumar@skybridge.com` / `CustomerPass2026!`

---

## 7. CI/CD Pipeline & Automated Deployment

This repository includes a fully automated **GitHub Actions CI/CD Pipeline** defined in [`.github/workflows/azure-webapp-cicd.yml`](.github/workflows/azure-webapp-cicd.yml).

### Workflow Lifecycle:
1. **Continuous Integration (CI):**
   - Automatically triggered on push to `main` branch.
   - Installs production dependencies (`npm ci`).
   - Executes node syntax validation checks (`node -c server.js`).
   - Packages build artifacts.
2. **Continuous Deployment (CD):**
   - Deploys build artifact to **Azure App Service** (`app-skybridge-portal-jay2026`) via Azure Publish Profile (`AZURE_WEBAPP_PUBLISH_PROFILE`).

---

## 8. REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return role session |
| `GET` | `/api/products` | Public | Fetch active cloud service catalog |
| `POST` | `/api/products` | Admin | Create a new cloud service product |
| `PUT` | `/api/products/:id` | Admin | Update pricing, tier, or description |
| `DELETE` | `/api/products/:id` | Admin | Delete a cloud service product |
| `GET` | `/api/cart` | Customer | Retrieve current user's shopping cart |
| `POST` | `/api/cart` | Customer | Add product to shopping cart |
| `PUT` | `/api/cart/:id` | Customer | Update item quantity |
| `DELETE` | `/api/cart/:id` | Customer | Remove item from cart |
| `GET` | `/api/status` | Public | System health and database engine status |

---

## 9. Academic Declaration & Author Information

- **Institution:** Auckland Institute of Studies (AIS), New Zealand
- **Faculty:** Faculty of Information Technology
- **Course:** SOFT807 - Cloud Applications Development
- **Student Name:** Jaykumar Maheshbhai Patel
- **Student ID:** 271074230
- **Student Email:** 271074230@aisstudent.ac.nz
- **Date:** October 2026
