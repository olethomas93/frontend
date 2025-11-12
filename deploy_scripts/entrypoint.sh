#!/bin/sh

# Sjekker om miljøvariabelen PREBUILD er satt til "true"
if [ "$PREBUILD" = "true" ]; then
    echo "PREBUILD is set to true, running custom command"
    npm run start
else
    echo "PREBUILD is not set to true, running default command (building and starting)"
    npm run as_docker1
fi
