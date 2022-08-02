#!/bin/sh
tsc
browserify ./src/main.js -p esmify > ./build/bundle.js
browserify ./build/index.js -p esmify > ./build/bundle2.js
