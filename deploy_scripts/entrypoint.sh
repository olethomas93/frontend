#!/bin/sh

if [ "$PREBUILD" = "true" ]; then
    echo "PREBUILD is set to true, starting Nuxt in production mode"
    npm run start
else
    echo "PREBUILD not enabled — building before starting"
    npm run build && npm run start
fi
