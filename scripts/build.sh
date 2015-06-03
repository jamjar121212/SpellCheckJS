#!/bin/bash          
echo "Building Project..."
mkdir dist
# -d (debug, generates source maps)
# -0 (output file)
./node_modules/.bin/browserify -d -o dist/app.js js/main.js

echo "Build Complete!"