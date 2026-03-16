#!/bin/bash

# Kinesis Cloud Shell Setup Script
# This script automates environment setup for Google Cloud Shell deployment
# Usage: chmod +x setup_env.sh && ./setup_env.sh

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🚀 KINESIS CLOUD SHELL SETUP SCRIPT                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Python version
echo "📍 Step 1: Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 10 ]); then
    echo -e "${RED}❌ Python 3.10+ required. You have $PYTHON_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python $PYTHON_VERSION detected${NC}"
echo ""

# 2. Check if API key is set
echo "📍 Step 2: Checking GOOGLE_API_KEY..."
if [ -z "$GOOGLE_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  GOOGLE_API_KEY not set in environment${NC}"
    echo "   To set it, run:"
    echo "   ${GREEN}export GOOGLE_API_KEY=\"your_api_key_here\"${NC}"
    echo ""
    read -p "   Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ GOOGLE_API_KEY is set${NC}"
fi
echo ""

# 3. Create .env file if it doesn't exist
echo "📍 Step 3: Setting up .env file..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Kinesis Environment Configuration
# Get a FREE API key from: https://aistudio.google.com/apikey
# Paste it below and restart the backend.

GOOGLE_API_KEY=your_google_api_key_here

# Model override (default: gemini-2.5-flash-native-audio-latest)
GEMINI_MODEL=gemini-2.5-flash-native-audio-latest
GEMINI_SECONDARY_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash-lite
EOF
    echo -e "${GREEN}✅ Created .env template${NC}"
    echo "   Update it with your API key: edit .env"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# 4. Install Python dependencies
echo "📍 Step 4: Installing Python dependencies..."
echo "   (Using pip install --user to avoid permission issues)"
echo ""

pip install --user -q google-genai python-dotenv fastapi uvicorn websockets aiohttp python-multipart

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# 5. Verify installations
echo "📍 Step 5: Verifying installations..."
python3 -c "import google.generativeai; print('  ✅ google-genai')" 2>/dev/null || echo "  ❌ google-genai"
python3 -c "import dotenv; print('  ✅ python-dotenv')" 2>/dev/null || echo "  ❌ python-dotenv"
python3 -c "import fastapi; print('  ✅ fastapi')" 2>/dev/null || echo "  ❌ fastapi"
python3 -c "import uvicorn; print('  ✅ uvicorn')" 2>/dev/null || echo "  ❌ uvicorn"
python3 -c "import websockets; print('  ✅ websockets')" 2>/dev/null || echo "  ❌ websockets"
echo ""

# 6. Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Set your API key (if not already set):"
echo -e "   ${GREEN}export GOOGLE_API_KEY=\"your_api_key_here\"${NC}"
echo ""
echo "2️⃣  Start Kinesis backend:"
echo -e "   ${GREEN}python3 backend/main_production.py${NC}"
echo ""
echo "3️⃣  Open Cloud Shell Web Preview (port 8080)"
echo ""
echo "4️⃣  Record your demo and submit to Devpost! 🚀"
echo ""
echo "For troubleshooting, see README_CLOUD_SHELL.md"
echo ""
