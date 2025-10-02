#!/bin/bash
# Modern Project Setup Script - Cross-platform
# UK Commission Admin Panel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect OS
detect_os() {
    case "$OSTYPE" in
        linux*) OS="linux" ;;
        darwin*) OS="macos" ;;
        cygwin*|msys*|win*) OS="windows" ;;
        *) OS="unknown" ;;
    esac
}

print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              UK Commission Admin Panel Setup                ║"
    echo "║                   Modern Architecture                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking system dependencies..."

    # Check Python
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        log_error "Python is not installed. Please install Python 3.8+"
        exit 1
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16+"
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi

    # Check git
    if ! command -v git &> /dev/null; then
        log_warning "Git is not installed. Version control features will be limited"
    fi

    log_success "All dependencies are satisfied"
}

setup_backend() {
    log_info "Setting up backend environment..."

    cd backend

    # Create virtual environment
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        if command -v python3 &> /dev/null; then
            python3 -m venv venv
        else
            python -m venv venv
        fi
    fi

    # Activate virtual environment based on OS
    if [ "$OS" = "windows" ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi

    # Upgrade pip
    log_info "Upgrading pip..."
    pip install --upgrade pip

    # Install dependencies
    log_info "Installing Python dependencies..."
    pip install -r requirements.txt

    # Install development dependencies
    if [ -f "requirements-dev.txt" ]; then
        pip install -r requirements-dev.txt
    fi

    log_success "Backend setup completed"
    cd ..
}

setup_frontend() {
    log_info "Setting up frontend environment..."

    cd frontend

    # Clean install
    if [ -d "node_modules" ]; then
        log_info "Removing existing node_modules..."
        rm -rf node_modules
    fi

    if [ -f "package-lock.json" ]; then
        rm package-lock.json
    fi

    # Install dependencies
    log_info "Installing Node.js dependencies..."
    npm install

    log_success "Frontend setup completed"
    cd ..
}

setup_database() {
    log_info "Setting up database..."

    cd backend

    # Activate virtual environment
    if [ "$OS" = "windows" ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi

    # Run database migrations
    if [ -f "alembic.ini" ]; then
        log_info "Running database migrations..."
        alembic upgrade head
    else
        log_info "Creating database tables..."
        python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
    fi

    # Create demo data if needed
    if [ -f "create_demo_data.py" ]; then
        log_info "Creating demo data..."
        python create_demo_data.py
    fi

    log_success "Database setup completed"
    cd ..
}

setup_git_hooks() {
    if command -v git &> /dev/null; then
        log_info "Setting up git hooks..."

        # Create pre-commit hook
        mkdir -p .git/hooks

        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for UK Commission Admin Panel

echo "Running pre-commit checks..."

# Check Python formatting
if command -v black &> /dev/null; then
    echo "Checking Python code formatting..."
    black --check backend/app/ || exit 1
fi

# Check JavaScript/TypeScript formatting
if command -v prettier &> /dev/null; then
    echo "Checking frontend code formatting..."
    cd frontend && npx prettier --check src/ || exit 1
    cd ..
fi

echo "Pre-commit checks passed!"
EOF

        chmod +x .git/hooks/pre-commit
        log_success "Git hooks configured"
    fi
}

create_env_files() {
    log_info "Creating environment configuration files..."

    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Database
DATABASE_URL=sqlite:///./sql_app.db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Environment
ENVIRONMENT=development
DEBUG=True

# API
API_V1_STR=/api/v1
PROJECT_NAME="UK Commission Admin Panel"
EOF
        log_success "Backend .env file created"
    fi

    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_API_BASE_URL=http://localhost:8000

# Environment
REACT_APP_ENVIRONMENT=development

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
EOF
        log_success "Frontend .env file created"
    fi
}

create_docker_config() {
    log_info "Creating Docker configuration..."

    # Docker Compose for development
    cat > docker-compose.dev.yml << EOF
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - ENVIRONMENT=development
      - DATABASE_URL=postgresql://user:password@db:5432/ukcommission
    depends_on:
      - db
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api/v1
    command: npm start

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ukcommission
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

    log_success "Docker configuration created"
}

run_tests() {
    log_info "Running tests..."

    # Backend tests
    cd backend
    if [ "$OS" = "windows" ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi

    if command -v pytest &> /dev/null; then
        log_info "Running backend tests..."
        pytest app/tests/ -v
    fi
    cd ..

    # Frontend tests
    cd frontend
    if [ -f "package.json" ]; then
        log_info "Running frontend tests..."
        npm test -- --watchAll=false --coverage
    fi
    cd ..

    log_success "Tests completed"
}

main() {
    print_banner
    detect_os
    log_info "Detected OS: $OS"

    # Parse arguments
    case "${1:-setup}" in
        "setup"|"install")
            check_dependencies
            setup_backend
            setup_frontend
            setup_database
            create_env_files
            setup_git_hooks
            create_docker_config
            log_success "🎉 Project setup completed successfully!"
            log_info "Next steps:"
            echo "  1. Review .env files in backend/ and frontend/"
            echo "  2. Run: ./setup-project.sh start"
            ;;
        "start")
            log_info "Starting development servers..."
            echo "Backend: http://localhost:8000"
            echo "Frontend: http://localhost:3000"
            echo "API Docs: http://localhost:8000/docs"
            ;;
        "test")
            run_tests
            ;;
        "clean")
            log_info "Cleaning project..."
            rm -rf backend/venv backend/__pycache__ backend/app/__pycache__
            rm -rf frontend/node_modules frontend/build
            log_success "Project cleaned"
            ;;
        "docker")
            log_info "Starting with Docker..."
            docker-compose -f docker-compose.dev.yml up --build
            ;;
        *)
            echo "Usage: $0 {setup|start|test|clean|docker}"
            exit 1
            ;;
    esac
}

main "$@"
