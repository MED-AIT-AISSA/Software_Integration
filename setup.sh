#!/bin/bash

# 1Create requirements.txt 
echo "Creating requirements.txt with versions..."
cat > requirements.txt <<EOL
flask==2.3.5
gunicorn==21.2.0
EOL
echo "requirements.txt created ..."

#  Create render.yaml
echo "Creating render.yaml..."
cat > render.yaml <<EOL
services:
  - type: web
    name: unit-converter
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app"
    plan: free
EOL
echo "render.yaml created."

# Print success message
echo "All files created successfully with specific versions!"