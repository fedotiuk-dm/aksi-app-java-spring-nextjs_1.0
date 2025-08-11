# 🧼 AKSI Dry Cleaning Order System

Professional dry‑cleaning management system with a production‑grade Order Wizard.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-21-ED8B00.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791.svg)
![Redis](https://img.shields.io/badge/Redis-8--alpine-DC382D.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black.svg)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)
![MUI](https://img.shields.io/badge/MUI-7.1.1-0081CB.svg)
![React%20Query](https://img.shields.io/badge/React%20Query-5.81.5-FF4154.svg)
![Zustand](https://img.shields.io/badge/Zustand-5.0.6-4E6E5D.svg)
![MapStruct](https://img.shields.io/badge/MapStruct-1.6.3-orange.svg)
![Lombok](https://img.shields.io/badge/Lombok-1.18.38-orange.svg)
![Liquibase](https://img.shields.io/badge/Liquibase-migrations-2962FF.svg)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D.svg)
![Springdoc](https://img.shields.io/badge/Springdoc-2.8.9-85EA2D.svg)
![PDFBox](https://img.shields.io/badge/PDFBox-3.0.5-555555.svg)
![ZXing](https://img.shields.io/badge/ZXing-3.5.3-000000.svg)
![iText](https://img.shields.io/badge/iText-5.5.13.4-3F7E00.svg)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED.svg)
![Maven](https://img.shields.io/badge/Maven-3.9+-C71A36.svg)
[![Orval](https://img.shields.io/badge/Orval-7.11.1-4B32C3.svg)](https://orval.dev)
[![CI](https://github.com/fedotiuk-dm/aksi-app-java-spring-nextjs_1.0/actions/workflows/update-readme-versions.yml/badge.svg?branch=main)](https://github.com/fedotiuk-dm/aksi-app-java-spring-nextjs_1.0/actions/workflows/update-readme-versions.yml)
![License](https://img.shields.io/badge/license-MIT-green.svg)

<br/>

[![Architecture](https://img.shields.io/badge/architecture-DDD%20%2B%20FSD-purple.svg)](#-architecture)
[![Docs](https://img.shields.io/badge/docs-available-blue.svg)](#-documentation)

</div>

---

### 🔗 Quick links

- Overview • Features • Tech Stack • Architecture • Structure • Quick Start • Docs • Contributing • License

---

## ✨ Overview

AKSI is a modern dry‑cleaning order management system built with Domain‑Driven Design (DDD) on the backend and Feature‑Sliced Design (FSD) on the frontend. The system covers the full customer journey from intake to delivery, with a robust guided Order Wizard at its core.

#### Order Wizard at a glance

1. Client & basic order info
2. Item manager with multi‑step item flow and live pricing
3. Global order parameters (discounts, urgency, payment)
4. Review and printable receipt (PDF with QR)

---

## 🧩 Key Features

<div align="center">

|       👤 Clients       |         🧺 Orders         |            💰 Pricing             |
| :--------------------: | :-----------------------: | :-------------------------------: |
| Quick search & history |    Guided Order Wizard    | Transparent modifiers & discounts |
|    Contacts & tags     | Cyclic item add/edit flow |       Live preview & totals       |
|   GDPR‑friendly data   |      Status tracking      |        Rounding & policies        |

|      📸 Photos       |     🧾 Documents     |            🔐 Security             |
| :------------------: | :------------------: | :--------------------------------: |
| Before/After gallery | PDF receipts with QR | Cookie‑based auth + Redis sessions |
|   Auto‑thumbnails    | Localized templates  |         Role‑based access          |

</div>

---

## 🛠 Tech Stack

### Backend (Java 21 + Spring Boot 3.5.4)

**Core Framework:**

- Java 21, Spring Boot 3.5.4
- Spring Web, Data JPA, Validation, Security, Actuator
- Spring Session with Redis for distributed sessions

**Database & Persistence:**

- PostgreSQL 17 with Liquibase migrations
- Spring Data JPA with Hibernate
- JPA Specifications for dynamic queries

**Mapping & Code Generation:**

- MapStruct 1.6.3 for DTO ↔ Entity mapping
- Lombok 1.18.38 for boilerplate reduction
- OpenAPI Generator for DTO/Controller generation

**Document Processing:**

- Apache PDFBox 3.0.5 for receipt PDF generation
- ZXing 3.5.3 for QR code generation
- Custom receipt templating system

**Security & Auth:**

- Cookie-based authentication (no JWT on client)
- Spring Security with Redis session store
- Role-based access control with permissions

### Frontend (Next.js 15 + React 19)

**Core Framework:**

- Next.js 15.3.4 with App Router
- React 19.1.0, TypeScript 5
- Feature-Sliced Design (FSD) architecture

**UI & State Management:**

- Material-UI 7.1.1 (MUI) with custom theming
- TanStack Query 5.81.5 for server state
- Zustand 5.0.6 for client UI state
- Zod 4.0.5 for runtime validation

**API Integration:**

- Orval for auto-generated React Query hooks
- OpenAPI → TypeScript client generation
- Axios with interceptors for HTTP handling

### DevOps & Quality

**Build & Testing:**

- Maven 3.9+ with multi-profile builds
- JUnit 5 for backend testing
- Checkstyle, PMD, SpotBugs for code quality
- Jest + Testing Library for frontend

**Development:**

- Docker Compose for local environment
- Hot reload for both frontend and backend
- Swagger UI for API documentation

---

## 🏗 Architecture

Principle: DDD inside (backend), FSD outside (frontend). Controllers are thin; business logic lives in domain services. OpenAPI contracts are the single source of truth.

```mermaid
graph TB
  subgraph "FSD (Frontend)"
    UI[UI Components]
    Features[Features]
    Pages[Pages]
  end

  subgraph "DDD (Backend)"
    Entities[Entities]
    Services[Domain Services]
    Repositories[Repositories]
    UseCases[Use Cases]
    Events[Domain Events]
  end

  subgraph "Infrastructure"
    API[REST API]
    DB[(PostgreSQL)]
    External[External Services]
  end

  UI --> Features
  Features --> API
  API --> UseCases
  UseCases --> Services
  Services --> Entities
  Services --> Repositories
  Repositories --> DB
```

Backend principles

- API‑first (OpenAPI) as the source of truth
- Cookie‑based auth; no JWT on the client
- Controllers → Services → Repository (no business logic in controllers)
- DTO ↔ Entity mapping via MapStruct
- Database migrations via Liquibase

---

## 📂 Project Structure

```
backend/
  src/main/resources/openapi/       # OpenAPI contracts (single source of truth)
  architecture/                     # Core architecture docs
frontend/
  shared/api/generated/             # Orval‑generated React Query hooks
  features/                         # Thin FSD UI features
docker/                             # docker-compose for local dev
```

---

## 🚀 Quick Start

Prerequisites

- Java 21+, Maven 3.9+
- Node.js 18+
- PostgreSQL 17

Backend

```
cd backend
mvn clean install -Pdev-fast
mvn spring-boot:run
```

Frontend

```
cd frontend
npm install
npm run dev
```

Docker (optional)

```
cd docker
docker compose -f docker-compose.dev.yml up -d
```

URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

---

## 📚 Documentation

Architecture

- OpenAPI‑first approach: `backend/architecture/OPENAPI_FIRST_APPROACH.md`
- Domain architecture: `backend/architecture/DOMAIN_ARCHITECTURE.md`
- Project structure: `backend/architecture/PROJECT_STRUCTURE.md`
- Domain interactions: `backend/architecture/DOMAIN_INTERACTIONS.md`
- Cookie‑based auth: `backend/architecture/COOKIE_BASED_AUTH.md`

Order Wizard (frontend notes)

- FSD implementation: `docs-helpers/frontend/order_wizard_fsd_implementation.md`
- Single‑page Order Wizard architecture: `docs-helpers/frontend/SinglePage_OrderWizard_Architecture.md`

---

## 🤝 Contributing

- Follow DDD inside, FSD outside
- Use Orval‑generated hooks directly in UI (no custom API clients)
- Zustand only for UI state; API data lives in React Query
- Keep files focused and testable; one responsibility per file
- Conventional Commits, ESLint/Prettier (FE), Checkstyle/PMD (BE)

---

## 📄 License

MIT License © 2025 AKSI Chemical Cleaning

See LICENSE file or the badges above for details.
