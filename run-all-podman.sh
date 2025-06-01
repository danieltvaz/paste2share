#!/bin/bash

image_exists() {
  podman image exists "$1"
}

if image_exists paste2share-backend; then
  echo "Image paste2share-backend already exists."
else
  echo "Building paste2share-backend image..."
  podman build -t paste2share-backend -f backend/Dockerfile ./backend
fi

if image_exists paste2share-frontend; then
  echo "Image paste2share-frontend already exists."
else
  echo "Building paste2share-frontend image..."
  podman build -t paste2share-frontend -f frontend/Dockerfile ./frontend
fi

echo "Running backend container..."
podman run -d -it --rm -p 3001:3001 -v $(pwd)/backend:/app paste2share-backend

echo "Running frontend container..."
podman run -d -it --rm -p 3000:3000 -v $(pwd)/frontend:/app paste2share-frontend
