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

FRONTEND_IMAGE_NAME=paste2share-frontend-$ENVIRONMENT
BACKEND_IMAGE_NAME=paste2share-backend-$ENVIRONMENT

image_exists() {
  $RUNNER image inspect "$1" > /dev/null 2>&1
}

if [ "$ENVIRONMENT" == "production" ]; then
  $RUNNER stop $BACKEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER rm $BACKEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER stop $FRONTEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER rm $FRONTEND_IMAGE_NAME 2>/dev/null || true

  echo "Limpando imagens, containers e volumes não utilizados..."
  $RUNNER system prune -af --volumes

  echo "Building $BACKEND_IMAGE_NAME image (production - forced rebuild)..."
  $RUNNER build --no-cache -t $BACKEND_IMAGE_NAME -f backend/Dockerfile.$ENVIRONMENT ./backend

  echo "Building $FRONTEND_IMAGE_NAME image (production - forced rebuild)..."
  $RUNNER build --no-cache -t $FRONTEND_IMAGE_NAME -f frontend/Dockerfile.$ENVIRONMENT ./frontend
else
  if image_exists $FRONTEND_IMAGE_NAME; then
    echo "Image $FRONTEND_IMAGE_NAME already exists."
  else
    echo "Building $FRONTEND_IMAGE_NAME image..."
    $RUNNER build -t $FRONTEND_IMAGE_NAME -f frontend/Dockerfile.$ENVIRONMENT ./frontend
  fi

  if image_exists $BACKEND_IMAGE_NAME; then
    echo "Image $BACKEND_IMAGE_NAME already exists."
  else
    echo "Building $BACKEND_IMAGE_NAME image..."
    $RUNNER build -t $BACKEND_IMAGE_NAME -f backend/Dockerfile.$ENVIRONMENT ./backend
  fi
fi

if [ "$ENVIRONMENT" == "development" ]; then
  BACKEND_VOLUME="-v $(pwd)/backend:/app"
  FRONTEND_VOLUME="-v $(pwd)/frontend:/app"
else
  BACKEND_VOLUME=""
  FRONTEND_VOLUME=""
fi

echo "Running backend container..."
$RUNNER run -d -it -p 3000:3000 --name $BACKEND_IMAGE_NAME $BACKEND_VOLUME $BACKEND_IMAGE_NAME

echo "Running frontend container..."
$RUNNER run -d -it -p 3001:3001 --name $FRONTEND_IMAGE_NAME $FRONTEND_VOLUME $FRONTEND_IMAGE_NAME

