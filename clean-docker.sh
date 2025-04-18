#!/bin/bash
echo "⚠️ Очистка непотрібного..."
docker system prune -af --volumes
echo "✅ Готово!"
