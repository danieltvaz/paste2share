#!/bin/bash

image_exists() {
  docker image inspect "$1" > /dev/null 2>&1
}

if image_exists paste2share-backend; then
  echo "Image paste2share-backend already exists."
else
  echo "Building paste2share-backend image..."
  docker build -t paste2share-backend -f backend/Dockerfile ./backend
fi

if image_exists paste2share-frontend; then
  echo "Image paste2share-frontend already exists."
else
  echo "Building paste2share-frontend image..."
  docker build -t paste2share-frontend -f frontend/Dockerfile ./frontend
fi

echo "Running backend container..."
docker run -d --rm -it -p 3001:3001 -v "$(pwd)/backend:/app" paste2share-backend

echo "Running frontend container..."
docker run -d --rm -it -p 3000:3000 -v "$(pwd)/frontend:/app" paste2share-frontend
