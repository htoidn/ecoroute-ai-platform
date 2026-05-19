#!/bin/bash

# EcoRoute AI Platform - Docker Quick Start Script
# This script builds and starts all services with the new features
# Usage: ./docker-start.sh [dev|prod|stop|logs|clean]

set -e

PROJECT_DIR="/Users/hdee/development/git/ecoroute-ai-platform"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV="${1:-dev}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

case "${ENV}" in
    dev)
        print_header "Starting EcoRoute AI Platform (Development)"

        print_info "Checking Docker installation..."
        if ! command -v docker &> /dev/null; then
            print_error "Docker not found. Please install Docker first."
            exit 1
        fi
        print_success "Docker found"

        print_info "Checking Docker Compose..."
        if ! command -v docker-compose &> /dev/null; then
            print_error "Docker Compose not found."
            exit 1
        fi
        print_success "Docker Compose found"

        print_info "Building Docker images (this may take a few minutes)..."
        docker-compose build
        print_success "Build complete"

        print_info "Starting services..."
        docker-compose up
        ;;

    dev-bg)
        print_header "Starting EcoRoute AI Platform (Background - Development)"

        print_info "Building Docker images..."
        docker-compose build
        print_success "Build complete"

        print_info "Starting services in background..."
        docker-compose up -d
        print_success "Services started in background"

        echo ""
        print_header "Access Points"
        echo -e "${GREEN}Frontend:${NC}  http://localhost:3000"
        echo -e "${GREEN}Backend:${NC}   http://localhost:8080"
        echo -e "${GREEN}AI Service:${NC} http://localhost:8000"
        echo -e "${GREEN}PgAdmin:${NC}    http://localhost:5050"
        echo -e "${GREEN}Database:${NC}   localhost:5432"

        echo ""
        print_info "View logs with: docker-compose logs -f"
        print_info "Stop services with: docker-compose down"
        ;;

    prod)
        print_header "Starting EcoRoute AI Platform (Production)"

        print_info "Building Docker images for production..."
        docker-compose -f docker-compose.prod.yml build
        print_success "Build complete"

        print_info "Starting production services..."
        docker-compose -f docker-compose.prod.yml up -d
        print_success "Production services started"

        echo ""
        print_header "Access Points"
        echo -e "${GREEN}Frontend:${NC}  http://localhost:80"
        echo -e "${GREEN}Backend:${NC}   http://localhost:8080"
        echo -e "${GREEN}AI Service:${NC} http://localhost:8000"

        echo ""
        print_info "View logs with: docker-compose -f docker-compose.prod.yml logs -f"
        print_info "Stop services with: docker-compose -f docker-compose.prod.yml down"
        ;;

    stop)
        print_header "Stopping EcoRoute AI Platform"

        if [ "${2:-}" == "prod" ]; then
            print_info "Stopping production services..."
            docker-compose -f docker-compose.prod.yml down
            print_success "Production services stopped"
        else
            print_info "Stopping development services..."
            docker-compose down
            print_success "Development services stopped"
        fi
        ;;

    clean)
        print_header "Cleaning EcoRoute AI Platform"

        print_info "This will remove all containers and volumes!"
        read -p "Are you sure? (yes/no): " confirm

        if [ "$confirm" == "yes" ]; then
            print_info "Shutting down services..."
            docker-compose down -v 2>/dev/null || true
            docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
            print_success "Cleaned up successfully"
        else
            print_info "Cleanup cancelled"
        fi
        ;;

    logs)
        print_header "EcoRoute AI Platform Logs"

        if [ "${2:-}" == "prod" ]; then
            docker-compose -f docker-compose.prod.yml logs -f "${3:-}"
        else
            docker-compose logs -f "${2:-}"
        fi
        ;;

    status)
        print_header "EcoRoute AI Platform Status"

        echo ""
        echo "Development Services:"
        docker-compose ps 2>/dev/null || echo "No dev services running"

        echo ""
        echo "Production Services:"
        docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "No prod services running"
        ;;

    rebuild)
        print_header "Rebuilding EcoRoute AI Platform"

        SERVICE="${2:-}"

        if [ -z "$SERVICE" ]; then
            print_info "Rebuilding all services..."
            docker-compose build --no-cache
        else
            print_info "Rebuilding $SERVICE service..."
            docker-compose build --no-cache "$SERVICE"
        fi
        print_success "Rebuild complete"
        ;;

    *)
        print_header "EcoRoute AI Platform - Docker Control"
        echo "Usage: ./docker-start.sh [COMMAND] [OPTIONS]"
        echo ""
        echo "Commands:"
        echo "  dev          Start development environment (foreground)"
        echo "  dev-bg       Start development environment (background)"
        echo "  prod         Start production environment"
        echo "  stop [prod]  Stop services (add 'prod' for production)"
        echo "  clean        Remove all containers and volumes"
        echo "  logs [srv]   View logs (optional: service name)"
        echo "  status       Show status of all services"
        echo "  rebuild [s]  Rebuild services (optional: service name)"
        echo ""
        echo "Examples:"
        echo "  ./docker-start.sh dev          # Start dev in foreground"
        echo "  ./docker-start.sh dev-bg       # Start dev in background"
        echo "  ./docker-start.sh prod         # Start production"
        echo "  ./docker-start.sh logs frontend # View frontend logs"
        echo "  ./docker-start.sh stop prod    # Stop production"
        echo "  ./docker-start.sh clean        # Clean everything"
        echo "  ./docker-start.sh rebuild frontend # Rebuild frontend"
        echo ""
        echo "After starting, access the application at:"
        echo "  Development: http://localhost:3000"
        echo "  Production:  http://localhost:80"
        ;;
esac

