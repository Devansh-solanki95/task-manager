# task-manager Application


A modern, production-ready Task Manager built with Java Spring Boot and React (Vite).

## Tech Stack
**Backend**: Java 17, Spring Boot 3.2, PostgreSQL, Hibernate/JPA, MapStruct, SpringDoc OpenAPI.
**Frontend**: React 18, Vite, Tailwind CSS, Tanstack React Query, Zustand, Axios, Lucide React.
**DevOps**: Docker, Docker Compose.

## Prerequisites
- Docker & Docker Compose
- Java 17 & Maven (if running independently)
- Node.js 20+ (if running independently)

## Quick Start (Dockerized)
The easiest way to run the entire stack (Database, Backend, Frontend) is via Docker Compose.

1. Ensure Docker is running.
2. In the root directory (`task-manager/`), run:
   ```bash
   docker-compose build
   docker-compose up -d
   ```
3. Application will be available at:
   - Frontend UI: `http://localhost:80` or `http://localhost:5173` depending on setup.
   - Backend API Docs (Swagger): `http://localhost:8080/swagger-ui.html`

## Running Locally for Development

### 1. Start Database
```bash
docker-compose up -d db
```

### 2. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
*(Note: If Maven isn't installed globally, use the provided maven wrapper or run via your IDE like IntelliJ/Eclipse).*

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The UI will run on `http://localhost:5173`.

## Architecture Details
- **Backend Clean Architecture**: Controller -> Service -> Repository -> Database. Data flows through DTOs mapped via MapStruct. Global exception handling is provided by `@RestControllerAdvice`.
- **Frontend Architecture**: Component-based React UI. Global state via Zustand, remote server state via React Query (caching, deduplication). Styling via Tailwind CSS glassmorphism components.

## API Documentation
Once the backend is running, the OpenAPI UI is available at `/swagger-ui.html`. 

### Key Endpoints:
- `GET /api/v1/tasks` (with optional `?status=PENDING` or pagination params)
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/{id}`
- `DELETE /api/v1/tasks/{id}`
