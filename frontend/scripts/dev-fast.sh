#!/bin/bash

# 🚀 ШВИДКИЙ ЗАПУСК FRONTEND
echo "🔄 Очищення npm кешу..."
npm cache clean --force

echo "📦 Видалення node_modules..."
rm -rf node_modules

echo "🔧 Видалення package-lock.json..."
rm -f package-lock.json

echo "⚡ Швидке встановлення залежностей..."
npm install --no-audit --no-fund --prefer-offline

echo "🚀 Запуск development сервера..."
npm run dev
