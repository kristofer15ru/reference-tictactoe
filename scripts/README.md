## Note:
### These scripts are generally called by other scripts and are often not intended to be run from this location.

Scripts that should be run by [project root]/[script name].sh:
- jenkins.sh
- build.sh
- docker-create-and-push.sh
- noderun.sh (possible but not advised)

Other scripts:
- docker-compose-and-run.sh
  - This script can be run anywhere as long as the docker-compose.yml file is in the same directory
- docker-compose.yml
  - This script can be used anywhere. It must be in the working directory when docker-compose up is commanded.
- Dockerfile
  - This script is required wherever a docker image is created for this project. Must be in the same directory as noderun.sh
