#!/bin/bash

# EcoRoute Selenium Test Runner
# Usage: ./run-selenium-tests.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Defaults
BASE_URL="${BASE_URL:-http://localhost:3000}"
HEADLESS="${HEADLESS:-1}"
REPORT="${REPORT:-0}"
VERBOSE="${VERBOSE:-1}"

# Function to print banner
print_banner() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║        EcoRoute Selenium Test Runner                       ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

# Function to print help
print_help() {
  echo -e "${YELLOW}EcoRoute Selenium Test Runner${NC}"
  echo ""
  echo "Usage: ./run-selenium-tests.sh [options]"
  echo ""
  echo "Options:"
  echo "  --url URL             Set base URL (default: http://localhost:3000)"
  echo "  --headless            Run in headless mode (default: true)"
  echo "  --no-headless         Run with visible browser"
  echo "  --report              Generate HTML report"
  echo "  --verbose             Show verbose output (default: true)"
  echo "  --quiet               Suppress verbose output"
  echo "  --help                Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./run-selenium-tests.sh                    # Run with defaults"
  echo "  ./run-selenium-tests.sh --no-headless      # Show browser"
  echo "  ./run-selenium-tests.sh --url http://localhost:5173"
  echo "  ./run-selenium-tests.sh --no-headless --report --verbose"
  echo ""
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --help)
      print_help
      exit 0
      ;;
    --url)
      BASE_URL="$2"
      shift 2
      ;;
    --headless)
      HEADLESS="1"
      shift
      ;;
    --no-headless)
      HEADLESS="0"
      shift
      ;;
    --report)
      REPORT="1"
      shift
      ;;
    --verbose)
      VERBOSE="1"
      shift
      ;;
    --quiet)
      VERBOSE="0"
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      print_help
      exit 1
      ;;
  esac
done

print_banner

# Build pytest command
echo -e "${BLUE}Configuration:${NC}"
echo "  Base URL: $BASE_URL"
echo "  Headless: $([ "$HEADLESS" = "1" ] && echo "Yes" || echo "No")"
echo "  Report: $([ "$REPORT" = "1" ] && echo "Yes" || echo "No")"
echo "  Verbose: $([ "$VERBOSE" = "1" ] && echo "Yes" || echo "No")"
echo ""

# Check if dependencies are installed
echo -e "${BLUE}Checking dependencies...${NC}"
if ! python -m pytest --version &> /dev/null; then
  echo -e "${RED}✗ pytest not found. Installing dependencies...${NC}"
  pip install -r selenium-tests/requirements-selenium.txt
else
  echo -e "${GREEN}✓ Dependencies found${NC}"
fi
echo ""

# Build pytest command
PYTEST_ARGS="selenium-tests/"
PYTEST_ARGS="$PYTEST_ARGS -v"

if [ "$VERBOSE" = "1" ]; then
  PYTEST_ARGS="$PYTEST_ARGS -s"
fi

if [ "$REPORT" = "1" ]; then
  PYTEST_ARGS="$PYTEST_ARGS --html=selenium-tests/report.html --self-contained-html"
  echo -e "${YELLOW}Report will be saved to: selenium-tests/report.html${NC}"
  echo ""
fi

# Run tests with environment variables
echo -e "${BLUE}Running tests...${NC}"
echo -e "${YELLOW}Command: BASE_URL=$BASE_URL HEADLESS=$HEADLESS pytest $PYTEST_ARGS${NC}"
echo ""

BASE_URL="$BASE_URL" HEADLESS="$HEADLESS" pytest $PYTEST_ARGS
TEST_RESULT=$?

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  if [ "$REPORT" = "1" ]; then
    echo -e "${GREEN}✓ Report generated: tests/selenium/report.html${NC}"
  fi
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi

