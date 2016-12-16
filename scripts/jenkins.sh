#Clear possible changes and reinstall the application

#Remove old containers if there are any
docker rm -f $(docker ps -qa)
#Remove old images
docker rmi -f $(docker images -qa)
#Remove old node_modules
rm -rf node_modules
rm -rf ./client/node_modules

#Make sure no changes to tracked files survive
git clean -dfx
git stash

./Makefile
