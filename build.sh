# Work in current location
export NODE_PATH=.
# Clean previous build if it does exist
npm run clean
# Make the build directory if it does not exist
npm run createbuild
# Run this script on the client if it exists
npm run buildclient
# Make the client build the new static build
mv client/build build/static
# copy the server into the new build
cp -R server build/server
# Create directory tree needed later
mkdir -p build/client/src
# Copy vital files that are not built
cp -r client/src/common build/client/src
cp run.js build

exit $?
