#!/bin/bash

# MMM-LogViewer Installation Script
# This script will install the MMM-LogViewer module for MagicMirror²

echo "=========================================="
echo "MMM-LogViewer Installation Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the MMM-LogViewer directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "=========================================="
    echo "Installation completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Add the module to your MagicMirror config.js file"
    echo "2. Restart MagicMirror"
    echo ""
    echo "Example configuration:"
    echo "{"
    echo "    module: 'MMM-LogViewer',"
    echo "    position: 'top_left',"
    echo "    config: {"
    echo "        logFilePath: '/var/log/syslog',"
    echo "        maxLines: 10,"
    echo "        updateInterval: 5000"
    echo "    }"
    echo "}"
    echo ""
    echo "For more configuration options, see README.md"
else
    echo "Error: Installation failed. Please check the error messages above."
    exit 1
fi
