#!/bin/bash

image_exists() {
  podman image exists "$1"
}

echo "Building paste2share-backend image..."
podman build -t paste2share-backend -f backend/Dockerfile ./backend

echo "Building paste2share-frontend image..."
podman build -t paste2share-frontend -f frontend/Dockerfile ./frontend

echo "Running backend container..."
podman run -d -it --rm -p 3001:3001 -v $(pwd)/backend:/app paste2share-backend

echo "Running frontend container..."
podman run -d -it --rm -p 3000:3000 -v $(pwd)/frontend:/app paste2share-frontend
