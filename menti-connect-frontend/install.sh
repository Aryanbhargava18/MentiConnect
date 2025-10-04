#!/bin/bash

echo "🚀 Installing MentiConnect Frontend Dependencies..."

# Install npm dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5001" > .env
    echo "✅ Created .env file"
fi

echo "✅ Installation complete!"
echo ""
echo "To start the development server, run:"
echo "npm run dev"
echo ""
echo "The frontend will be available at http://localhost:3000"
