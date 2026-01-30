.PHONY: dev backend frontend install stop help

dev:
	@echo "Starting Red Airlines..."
	@cd backend && docker-compose up -d
	@echo "Waiting for backend to be ready..."
	@sleep 3
	@cd frontend && make dev

backend:
	@cd backend && docker-compose up

frontend:
	@cd frontend && make dev

install:
	@echo "Installing dependencies..."
	@cd backend && go mod download
	@cd frontend && npm install
	@echo "Done"

stop:
	@cd backend && docker-compose down

help:
	@echo "Red Airlines Development:"
	@echo "  make dev       - Start backend (Docker) and frontend"
	@echo "  make backend   - Start only backend"
	@echo "  make frontend  - Start only frontend"
	@echo "  make install   - Install all dependencies"
	@echo "  make stop      - Stop backend containers"
