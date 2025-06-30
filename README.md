# Quickly

**Quickly** is a job marketplace platform that allows customers to post jobs and service providers to either bid on jobs or accept them instantly. It supports two workflows: **Quick Book** (instant booking) and **Post & Quote** (bidding). Providers can manage their jobs, bids, and statuses via a dedicated dashboard. The system is built for modularity and future extensibility.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone git@github.com:ThaungPyaePhyo/quickly.git
cd quickly
```

### 2. Copy environment files

```bash
cd frontend
cp .env.example .env.local
cp .env.example .env.develop

cd ../backend
cp .env.example .env.local
cp .env.example .env.develop
```

### 3. Start all services
> **Tip:** You can use all `make` commands listed in the [Makefile](./Makefile) for common tasks like starting, stopping, building, testing, and more.

```bash
make up
```

### 4. (Optional) Stop all services

```bash
make down
```

### 5. Build backend and frontend images (optional, usually handled by `make up`)

```bash
make backend-build
make frontend-build
```

### 6. Run backend tests

```bash
make test
```

---

## API Reference

- [OpenAPI Spec](./backend/openapi.yaml) (if available)
- After running, visit:
  - Frontend: [http://localhost](http://localhost)
  - Backend API: [http://localhost/api](http://localhost/api)
  - Prisma Studio: [http://localhost:5555](http://localhost:5555)

---

## Test Command

To run all backend tests:
```bash
make test
```
or
```bash
make backend-test
```

---

MIT © 2025 Quickly Team
