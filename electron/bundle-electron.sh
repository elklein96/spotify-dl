#!/bin/bash          

CWD=$(pwd)

if [ -d "$CWD/client-dist" ]; then
    rm -rf $CWD/client-dist
fi

if [ -d "$CWD/api-dist" ]; then
    rm -rf $CWD/api-dist
fi

cd ../api
npm run babel
cp -R dist $CWD/api-dist
cp config.json $CWD/config.json

cd ../client
npm run build
cp -R dist $CWD/client-dist
cp -R static $CWD/static
