#!/bin/bash

# Setup script for number-to-word-az

echo "Setting up number-to-word-az development environment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create dist directory
mkdir -p dist

# Run initial build
echo "Building package..."
npm run build

# Run tests
echo "Running tests..."
npm test

echo "Setup complete! You can now start developing."
echo "Use 'npm run dev' to start the development server with watch mode."
echo "Use 'npm run build' to build the package for production."
echo "Use 'npm test' to run the tests." 