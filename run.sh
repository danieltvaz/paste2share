#!/bin/bash
set -e

RUNNER=$1
ENVIRONMENT=$2

if [ "$RUNNER" != "docker" ] && [ "$RUNNER" != "podman" ]; then
  echo "❌ Invalid runner: $RUNNER. Use 'docker' or 'podman'."
  exit 1
fi

if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "development" ]; then
  echo "❌ Invalid environment: $ENVIRONMENT. Use 'production' or 'development'."
  exit 1
fi

FRONTEND_IMAGE_NAME="paste2share-frontend-$ENVIRONMENT"
BACKEND_IMAGE_NAME="paste2share-backend-$ENVIRONMENT"

image_exists() {
  $RUNNER image inspect "$1" > /dev/null 2>&1
}

if [ "$ENVIRONMENT" == "production" ]; then
  echo "===> Stopping and removing existing containers..."

  $RUNNER stop $BACKEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER rm $BACKEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER stop $FRONTEND_IMAGE_NAME 2>/dev/null || true
  $RUNNER rm $FRONTEND_IMAGE_NAME 2>/dev/null || true

  echo "===> Cleaning unused images, containers and volumes..."
  $RUNNER system prune -af --volumes

  echo "===> Building backend image (production)..."
  $RUNNER build \
    --no-cache \
    -t $BACKEND_IMAGE_NAME \
    -f backend/Dockerfile.$ENVIRONMENT \
    ./backend

  echo "===> Building frontend image (production)..."

  if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "❌ NEXT_PUBLIC_API_URL is NOT set. Aborting build."
    exit 1
  fi

  echo "Using NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

  $RUNNER build \
    --no-cache \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    -t $FRONTEND_IMAGE_NAME \
    -f frontend/Dockerfile.$ENVIRONMENT \
    ./frontend


else
  if image_exists $BACKEND_IMAGE_NAME; then
    echo "Backend image already exists: $BACKEND_IMAGE_NAME"
  else
    echo "Building backend image (development)..."
    $RUNNER build -t $BACKEND_IMAGE_NAME -f backend/Dockerfile.$ENVIRONMENT ./backend
  fi

  if image_exists $FRONTEND_IMAGE_NAME; then
    echo "Frontend image already exists: $FRONTEND_IMAGE_NAME"
  else
    echo "Building frontend image (development)..."
    $RUNNER build \
      --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
      -t $FRONTEND_IMAGE_NAME \
      -f frontend/Dockerfile.$ENVIRONMENT \
      ./frontend
  fi
fi


if [ "$ENVIRONMENT" == "development" ]; then
  BACKEND_VOLUME="-v $(pwd)/backend:/app"
  FRONTEND_VOLUME="-v $(pwd)/frontend:/app"
else
  BACKEND_VOLUME=""
  FRONTEND_VOLUME=""
fi

echo "===> Running backend container..."
$RUNNER run -d \
  -p 3000:3000 \
  --name $BACKEND_IMAGE_NAME \
  -e NODE_ENV=production \
  -e PORT=3000 \
  $BACKEND_VOLUME \
  $BACKEND_IMAGE_NAME

echo "===> Running frontend container..."
$RUNNER run -d \
  -p 3001:3001 \
  --name $FRONTEND_IMAGE_NAME \
  $FRONTEND_VOLUME \
  $FRONTEND_IMAGE_NAME

echo "✅ Deploy completed successfully!"
