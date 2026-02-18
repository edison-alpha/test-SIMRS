#!/bin/bash

# SIMRS Bun Setup Script
# Script ini akan menginstall dependencies menggunakan Bun

echo "🚀 Setting up SIMRS with Bun..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun tidak ditemukan. Menginstall Bun..."
    curl -fsSL https://bun.sh/install | bash
    
    # Reload shell configuration
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc"
    fi
fi

echo "✅ Bun version: $(bun --version)"

# Install dependencies
echo "📦 Installing dependencies with Bun..."
bun install

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now run:"
    echo "   bun run bun:dev     # Start development server"
    echo "   bun run bun:build   # Build for production"
    echo "   bun test            # Run tests"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
