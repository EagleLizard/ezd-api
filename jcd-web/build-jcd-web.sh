#!/bin/bash

echo "OUTPUT_DIR: $OUTPUT_DIR"

echo "Cloning repository..."
git clone https://github.com/EagleLizard/jcd-v3.git

echo "Building..."
cd jcd-v3
npm ci
npm run build

# mkdir $OUTPUT_DIR
cp -a ./dist/. $OUTPUT_DIR/

