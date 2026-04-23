#!/bin/bash
# Ripples of Healing — Local Server Launcher
# Double-click this file to start the site

cd "$(dirname "$0")"

# Kill any existing server on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start server
echo "Starting Ripples of Healing..."
python3 -m http.server 8080 &
SERVER_PID=$!

# Wait for server to start
sleep 1

# Open in default browser at localhost (autoplay works here)
open http://localhost:8080

echo "Site running at http://localhost:8080"
echo "Press Ctrl+C to stop the server"

# Keep running until user stops it
wait $SERVER_PID
