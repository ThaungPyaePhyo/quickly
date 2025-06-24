COMPOSE=docker compose
DEV_FILE=docker-compose.yml
PROD_FILE=docker-compose.yml

# ---------- Common Commands ----------
up:
	$(COMPOSE) -f $(DEV_FILE) up --build

start:
	$(COMPOSE) -f $(DEV_FILE) up -d

down:
	$(COMPOSE) -f $(DEV_FILE) down

logs:
	$(COMPOSE) -f $(DEV_FILE) logs -f

ps:
	$(COMPOSE) -f $(DEV_FILE) ps

restart:
	$(COMPOSE) -f $(DEV_FILE) restart

# ---------- Backend ----------
backend-build:
	docker build -t quickly-backend ./backend

backend-shell:
	docker exec -it backend sh

backend-test:
	docker exec -it backend npm run test

backend-prisma-migrate:
	docker exec -it backend npx prisma migrate dev

backend-prisma-generate:
	docker exec -it backend npx prisma generate

backend-seed:
	docker exec -it backend npm run seed

studio:
	docker exec -it backend npx prisma studio


# ---------- Frontend ----------
frontend-build:
	docker build -t quickly-frontend ./frontend

frontend-shell:
	docker exec -it frontend sh

# ---------- Prod ----------
prod-up:
	$(COMPOSE) -f $(PROD_FILE) up --build -d

prod-down:
	$(COMPOSE) -f $(PROD_FILE) down

# ---------- Misc ----------
clean:
	docker system prune -f

