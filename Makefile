#!/bin/bash

#Get git variables
export STUDENTNAME='kristofer15'
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GITHUB_URL=$(git config --get remote.origin.url)
fi

# === CREATE A NEW BUILD ===

echo Building app
./build.sh

# Get last return code
rc=$?

# If the build script did not return 0, stop and return what it returned
if [[ $rc != 0 ]] ; then
    echo build script exited with code $rc
    exit $rc
fi

#Create a directory for build information
mkdir -p ./build/public

#Write build information
cat > ./build/githash.txt <<_EOF_
$GIT_COMMIT
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

#Copy scripts from project root into the new build directory that were not covered by npm run build
cp ./Dockerfile ./build/
cp ./package.json ./build/
cp ./run.js ./build/
cp ./noderun ./build/

#Move into build
cd build
echo Building docker image

#Create a new docker image
docker build -t $STUDENTNAME/tictactoe .

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

#Push any changes to the image to dockerhub
echo pushing new docker image
docker push $STUDENTNAME/tictactoe
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo "Done"
