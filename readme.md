Compiling this is becoming a bit of an effort.

First, you will use tsc (typescript compiler) to compile our typescript code from /src into javascript code in /build.

simply type tsc in the root directory of this project to do that

Then you will need to create some bundles for these modules to run in the browser using browserify and esmify.

Run this in the terminal to compile our UUID node library

browserify ./build/main.js -p esmify > ./build/bundle.js

And then run this to create a bundle to adjust our "import" and "export" syntax to something the browser won't complain about.

browserify ./build/index.js -p esmify > ./build/bundle2.js

from there index.html should run
