#!/bin/bash
set -e                  #Exit on failure

sleep 10 		#Give the database some time to get ready (Sloppy fix)	
export NODE_PATH=.	#Set the node path for the container so that migratedb runs properly
npm run migratedb	#Migrate server and db
node run.js		#Start the server

exit 0
