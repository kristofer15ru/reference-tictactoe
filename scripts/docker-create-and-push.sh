#Call the build script, create a docker image from the build and push it to hub.docker
#note: the environment variables are kept in a .env file in the build

# Create a new build
echo Building app
scripts/build.sh
cp scripts/Dockerfile build
cp scripts/noderun.sh build

# Get last return code
rc=$?

# If the build script did not return 0, stop and return what it returned
if [[ $rc != 0 ]] ; then
    echo build script exited with code $rc
    exit $rc
fi

#Move into the build
cd build
echo Building docker image

#Export variables stored in build/.env
export $(cat .env)

#Create a new docker image
docker build -t kristofer15/tictactoe:${GIT_COMMIT} .

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

#Push any changes to the image to dockerhub
echo pushing new docker image
docker push kristofer15/tictactoe:${GIT_COMMIT}
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

exit 0
