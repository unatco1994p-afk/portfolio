# Portfolio OS | Engineering Showcase

A high-performance, cloud-native engineering portfolio and interactive CV application built with **Quarkus (Java 21)** and **Angular 19**, organized as a clean monorepo. 

The application showcases modern software design patterns including **Angular Signals**, standalone component architecture, **RESTful microservice endpoints**, and a SaaS-inspired **Glassmorphism UI** ("Engineering Elegance").

---

## 🚀 Key Architectural Highlights

- **Frontend**: **Angular 19** Single Page Application (SPA) utilizing Signals (`signal`, `computed`), standalone components, native control flow (`@if`, `@for`), typed reactive services, and a modular SCSS design system.
- **Backend**: **Quarkus 3.x (Java 21 LTS)** high-performance REST API serving typed portfolio assets from zero-overhead JSON data models. Built for ultra-low latency and GraalVM Native Image compilation (< 50MB RAM footprint).
- **Design System**: "Engineering Elegance" theme featuring Obsidian dark surfaces (`#051424`), Electric Blue highlights (`#8ed5ff`), Emerald Green metric indicators (`#4edea3`), and typography powered by *Inter* & *JetBrains Mono*.

---

## 📁 Repository Structure

```text
portfolio/
├── backend/                  # Quarkus REST API (Java 21)
│   ├── src/main/java/       # DTOs, Data Services, & REST Endpoints
│   ├── src/main/resources/  # Portfolio JSON data & application configuration
│   ├── src/test/java/       # Integration tests (@QuarkusTest & REST Assured)
│   ├── mvnw.cmd / mvnw      # Maven Wrapper
│   └── pom.xml
├── frontend/                 # Angular 19 SPA
│   ├── src/app/             # Signals-driven components, layout, & services
│   ├── proxy.conf.json      # Dev proxy forwarding /api to Quarkus (8080)
│   ├── angular.json
│   └── package.json         # Strict exact package dependency pinning
├── .gitignore
├── portfolio.spec.md         # Project technical specification & roadmap
└── README.md
```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your environment:

- **Node.js**: `v20.11+` (or Node.js v20 LTS / v22+)
- **Java Development Kit (JDK)**: `Java 21 LTS` (e.g. Temurin 21)

---

## 💻 Getting Started (Local Development Mode)

To run the full stack locally with live hot-reloading:

### 1. Start the Quarkus Backend (Port 8080)

Open a terminal window and execute:

```bash
cd backend
.\mvnw.cmd quarkus:dev
# On Linux / macOS: ./mvnw quarkus:dev
```

The Quarkus backend will start on **`http://localhost:8080`**.  
Available REST API endpoints:
- `GET http://localhost:8080/api/portfolio`
- `GET http://localhost:8080/api/profile`
- `GET http://localhost:8080/api/projects`
- `GET http://localhost:8080/api/skills`
- `GET http://localhost:8080/api/experiences`
- `GET http://localhost:8080/api/metrics`

---

### 2. Start the Angular Frontend (Port 4200)

Open a second terminal window and run:

```bash
cd frontend
npm start
```

The Angular dev server will launch at **`http://localhost:4200`**.  
The development server automatically proxies API requests (`/api/*`) from port 4200 to the Quarkus backend on port 8080. If the backend is offline, the frontend safely falls back to default cached mock state.

---

## 🧪 Running Tests

### Backend Integration Tests (Quarkus + JUnit 5 + REST Assured)
```bash
cd backend
.\mvnw.cmd test
```

### Frontend Unit Tests (Angular + Karma)
```bash
cd frontend
npm test
```

---

## 📦 Production Builds

### Build Backend JAR
```bash
cd backend
.\mvnw.cmd package
```

### Build Frontend Static Bundle
```bash
cd frontend
npm run build
```
The compiled SPA production bundle will be generated in `frontend/dist/portfolio-frontend`.

---

## 🐳 Local Containerized Production Mode (Docker Compose)

To build and launch the entire production stack (Angular SPA served by Nginx + Quarkus Fast-Jar microservice) in isolated containers:

```bash
docker compose up --build
```

- **Frontend**: Access the production Nginx server at **`http://localhost:80`** (or `http://localhost`).
- **Backend**: Access the Quarkus REST API directly at **`http://localhost:8080/api/portfolio`**.
- To stop the containers:
  ```bash
  docker compose down
  ```

