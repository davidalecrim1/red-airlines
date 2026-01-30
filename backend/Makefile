.PHONY: postgres-up postgres-down postgres-migrate postgres-shell postgres-reset seed generate server playground-up format lint install-tools run

postgres-up:
	@docker compose up -d postgres

postgres-down:
	@docker compose down

postgres-migrate:
	@DATABASE_URL="host=localhost port=5432 user=postgres password=postgres dbname=red_airlines sslmode=disable" go run cmd/migrate/main.go

postgres-shell:
	@docker exec -it red-airlines-postgres psql -U postgres -d red_airlines

postgres-reset: postgres-down postgres-up
	@sleep 2
	@$(MAKE) postgres-migrate
	@$(MAKE) seed

seed: postgres-migrate
	@go run cmd/seed/main.go

generate:
	@go run github.com/99designs/gqlgen generate

server:
	@go run cmd/server/main.go

playground-up:
	@docker compose up -d graphql-playground

run:
	@echo "Starting services..."
	@docker compose up -d postgres
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker exec red-airlines-postgres pg_isready -U postgres > /dev/null 2>&1; do \
		sleep 1; \
	done
	@echo "Running migrations..."
	@$(MAKE) postgres-migrate
	@echo "Starting backend container..."
	@docker compose up -d backend

install-tools:
	@echo "Installing development tools..."
	@go install mvdan.cc/gofumpt@latest
	@go install golang.org/x/tools/cmd/goimports@latest
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@go install golang.org/x/tools/go/analysis/passes/modernize/cmd/modernize@latest
	@go install github.com/air-verse/air@latest
	@echo "Tools installed successfully"

format:
	@gofumpt -w .
	@goimports -w -local github.com/davidalecrim/red-airlines .
	@modernize -fix ./...

lint: format
	@golangci-lint run --fix

.PHONY: help
help:
	@echo "Database commands:"
	@echo "  make postgres-up      - Start PostgreSQL container"
	@echo "  make postgres-down    - Stop PostgreSQL container"
	@echo "  make postgres-migrate - Run database migrations"
	@echo "  make postgres-shell   - Open psql shell"
	@echo "  make postgres-reset   - Reset database"
	@echo "  make seed             - Generate sample data"
	@echo ""
	@echo "GraphQL commands:"
	@echo "  make generate         - Generate gqlgen code"
	@echo "  make server           - Start GraphQL server"
	@echo "  make playground-up    - Start GraphQL Playground"
	@echo ""
	@echo "Code quality commands:"
	@echo "  make format           - Format code with gofumpt, goimports, and modernize"
	@echo "  make lint             - Run formatter and linter with golangci-lint"
	@echo "  make install-tools    - Install all development tools"
	@echo ""
	@echo "Development commands:"
	@echo "  make run              - Start all services (postgres, playground, server)"
