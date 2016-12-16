#Build the code
#note: npm must be installed already. See Makefile

#Get git variables
export STUDENTNAME='kristofer15'
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GITHUB_URL=$(git config --get remote.origin.url)
fi

#Set node path to this location
export NODE_PATH=.
#delete the old build if there is one
if [ -d ./build ]; then rm -r ./build; fi
#Make the build directory
mkdir build
#Build the client
npm run buildclient
# Make the client build the new static build
mv client/build build/static
# copy the server into the new build
cp -R server build/server
# Create directory tree needed later
mkdir -p build/client/src
# Copy vital files that are not built
cp -r client/src/common build/client/src
cp run.js ./build
cp package.json ./build

#Create a directory for build information
mkdir -p ./build/public

#Write build information
cat > ./build/.env <<_EOF_
GIT_COMMIT=$GIT_COMMIT
_EOF_

cat > ./build/public/version.html << _EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

#Exit with the last return code
exit $?
