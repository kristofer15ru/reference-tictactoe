#Remove old node_modules
rm -rf node_modules
rm -rf ./client/node_modules
#Remove everything else
git clean -dfx
git stash

#install npm again
npm install
cd client
npm install
cd ..
#Build
./Makefile

