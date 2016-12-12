#Remove old node_modules
rm -rf node_modules
rm -rf ./client/node_modules

#Make sure no changes to tracked files survive
git clean -dfx
git stash

#install npm again
npm install
cd client
npm install
cd ..
#Build
./Makefile

