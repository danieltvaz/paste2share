#!/bin/bash
RUNNER=$1
ENVIRONMENT=$2

if [ "$RUNNER" == "docker" ] || [ "$RUNNER" == "podman" ]; then
  echo "Runner is valid: $RUNNER"
else
  echo "Invalid runner: $RUNNER. Use 'docker' or 'podman'."
  exit 1
fi

if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "development" ]; then
  echo "Environment is valid: $ENVIRONMENT"
else
  echo "Invalid environment: $ENVIRONMENT. Use 'production' or 'development'."
  exit 1
fi

image_exists() {
  $RUNNER image inspect "$1" > /dev/null 2>&1
}

if image_exists paste2share-backend; then
  echo "Image paste2share-backend already exists."
else
  echo "Building paste2share-backend image..."
  $RUNNER build -t paste2share-backend -f backend/Dockerfile.$ENVIRONMENT ./backend
fi

if image_exists paste2share-frontend; then
  echo "Image paste2share-frontend already exists."
else
  echo "Building paste2share-frontend image..."
  $RUNNER build -t paste2share-frontend -f frontend/Dockerfile.$ENVIRONMENT ./frontend
fi

if [ "$ENVIRONMENT" == "development" ]; then
  BACKEND_VOLUME="-v $(pwd)/backend:/app"
  FRONTEND_VOLUME="-v $(pwd)/frontend:/app"
else
  BACKEND_VOLUME=""
  FRONTEND_VOLUME=""
fi

# Rodar containers
echo "Running backend container..."
$RUNNER run -d --rm -it -p 3000:3000 $BACKEND_VOLUME paste2share-backend

echo "Running frontend container..."
$RUNNER run -d --rm -it -p 3001:3001 $FRONTEND_VOLUME paste2share-frontend