.PHONY: postgres-up postgres-down postgres-migrate postgres-shell postgres-reset seed

postgres-up:
	docker compose up -d postgres

postgres-down:
	docker compose down

postgres-migrate:
	go run scripts/migrate.go

postgres-shell:
	docker exec -it red-airlines-postgres psql -U postgres -d red_airlines

postgres-reset: postgres-down postgres-up
	sleep 2
	$(MAKE) postgres-migrate
	$(MAKE) seed

seed: postgres-migrate
	go run scripts/seed.go

.PHONY: help
help:
	@echo "Database commands:"
	@echo "  make postgres-up            - Start PostgreSQL container"
	@echo "  make postgres-down          - Stop PostgreSQL container"
	@echo "  make postgres-migrate       - Run database migrations"
	@echo "  make postgres-shell         - Open psql shell"
	@echo "  make postgres-reset         - Reset database (down, up, migrate, seed)"
	@echo "  make seed                   - Generate 1000 flights, 3000 fares, 100k bookings"
