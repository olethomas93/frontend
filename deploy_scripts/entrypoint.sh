#!/bin/sh

set -e

if [ "$PREBUILD" = "true" ]; then
    echo "PREBUILD is set to true, running build before start"
    npm run build
else
    echo "PREBUILD is not set to true, starting without extra build step"
fi

exec npm run start
