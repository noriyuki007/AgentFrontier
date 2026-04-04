#!/bin/bash
echo "Starting build..."
npm run build

echo "Build complete. Starting FTP transfer via Node..."
node deploy.js
