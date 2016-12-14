#Using node libraries
FROM node
#Set the working directory to the current location
WORKDIR .
#Copy every file here into the image
COPY . .
#Set the node path to the current directory
ENV NODE_PATH .
#install the node package manager
RUN npm install --silent
#Open port 80
EXPOSE 80
#Run noderun
CMD ./noderun.sh
