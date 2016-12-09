#Undock all
docker rm -f $(docker ps -qa)
docker rmi -f $(docker images -qa)

docker-compose up -d
