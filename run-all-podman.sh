#!/bin/bash

image_exists() {
  podman image exists "$1"
}

echo "Building paste2share-backend image..."
podman build -t paste2share-backend -f backend/Dockerfile ./backend

echo "Building paste2share-frontend image..."
podman build -t paste2share-frontend -f frontend/Dockerfile ./frontend

echo "Stopping existing containers..."
podman stop $(podman ps -q --filter ancestor=paste2share-backend) 2>/dev/null || true
podman stop $(podman ps -q --filter ancestor=paste2share-frontend) 2>/dev/null || true

echo "Running backend container..."
podman run -d -it --rm -p 3001:3001 \
  -v $(pwd)/backend:/app \
  -v /app/node_modules \
  paste2share-backend

echo "Running frontend container..."
podman run -d -it --rm -p 3000:3000 \
  -v $(pwd)/frontend:/app \
  -v /app/node_modules \
  -v /app/.next \
  paste2share-frontend
