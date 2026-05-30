#!/bin/bash

# NemoForge Launch Script
echo "🚀 Launching NemoForge Platform..."

echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo "⚙️ Setting up environment..."
cd ..
if [ ! -f .env ]; then
  echo "📄 Copying .env.example to .env..."
  cp .env.example .env
fi

echo "🌐 Starting services..."
npm run dev
