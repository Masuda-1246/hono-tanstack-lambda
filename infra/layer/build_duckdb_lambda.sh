#!/bin/bash

set -e

IMAGE_NAME="duckdb-layer-builder"
CONTAINER_NAME="duckdb-layer-container"
OUTPUT_DIR="./dist"

docker build --platform linux/amd64 -t $IMAGE_NAME .
mkdir -p "$OUTPUT_DIR"
docker create --name $CONTAINER_NAME $IMAGE_NAME
docker cp $CONTAINER_NAME:/layer/duckdb-layer.zip $OUTPUT_DIR/
docker rm $CONTAINER_NAME

echo "✅ Layer zip is ready: $OUTPUT_DIR/duckdb-layer.zip"
