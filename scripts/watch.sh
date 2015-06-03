#!/bin/bash          

mkdir dist

# -d (debug, generates source maps)
# -0 (output file)
# -v (verbose output)
./node_modules/.bin/watchify js/main.js -d -o dist/app.js -v