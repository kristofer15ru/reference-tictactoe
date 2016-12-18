
## Scripts
- Make
  - Name: Makefile
  - Purpose: Installs npm in the project root and client. This should install node_modules and cover required dependencies. These operations are vital for running the code properly.
- Build
  - Name: build.sh
  - Purpose: Clear previous builds and create a new one in [project root]/build/
  
- Docker build
  - Name: docker-create-and-build.sh
  - Purpose: Calls the build script to remove old builds and create a new one, create a docker image from it and push it to hub.docker

- Docker compose
  - 1:
    - Name: docker-compose-and-run.sh
    - Purpose: Erases all containers and images and creates new ones specified by docker-compose.yml. Could possibly be improved by only removing tictactoe images
  - 2:
    - Name: docker-compose.yml
    - Purpose: Specifies which images are to be run together, their variables and how they can interact when the docker-compose up command is issued. This is how the production server runs it's image.

- Docker general
  - 1:
    - Name: Dockerfile
    - Purpose: Sets up dependencies for the docker image and containers created from it. Specifies how the container shall run, what libraries to use and what ports to open.
  - 2:
    - Name: noderun.sh
    - Purpose: Runs when a container is created from the docker image designed by the Dockerfile. Migrates the server and database before starting the server through node run.js.
- Jenkins
  - Name: jenkins.sh
  - Purpose: Base script used by Jenkins. Attempts to clear any unwanted files from previous runs and then calls the Makefile to create a fresh install to work with.

- AWS Provisioning
  - Not implemented

## Testing & logic
- UnitTests, server logic TDD (Git commit log)
  - Implemented tests:
    - should emit FullGameJoinAttempted event when game full
    - should emit MovePlaced event on the first move
    - should emit IllegalMove when square is already occupied
    - Should emit IllegalMove when move attempt is out of bounds
    - Should emit NotYourMove if attempting to make move out of turn
    - Should emit NotYourMove if O tries to start
    - Should emit GameWon on a horizontal win
    - Should emit GameWon on a vertical win
    - Should emit GameWon on a diagonal win from 0 to 8
    - Should emit GameWon on a diagonal win from 2 to 6
    - Should emit GameDraw when neither wins
    - Should not emit GameDraw when the game is won in the last move

- API Acceptance test - fluent API
  - Implemented tests:
    - should be able to play game to end

- Load test loop
  - Implemented tests:
    - should create and play 100 games within 15000ms
- UI TDD
  - Implemented tests:
    - should record move with matching game id and coordinates
    - REST EXPECTED JUST PAST HAND IN TIME
- Is the game playable?
  - Yes. Information about which symbol you are playing and the game end results have not been implemented yet but symbols can be placed and server side logic successfully limits it to legal behaviour.

## Data migration
- Migration up and down
  - A data migration was created. A "[dateOfCreation]addEventCol.log" file has been added to "[project root]/server/migrations/". It is used to add a column to the eventlog table. The down function is not expected to be needed since the table already has a down function that drops it entirely.


## Jenkins
- Implemented Jenkins stages:
  - CommitStage
    - URL: http://82.221.49.96:8080/job/kristofer15-tictactoe-CommitStage/
    - Purpose: Pull any changes made to the project, clean any previous changes made to it and attempt to build it, perform server side unit tests, create an image from the build and push it to hub.docker.
  - DeployStage
    - URL: http://82.221.49.96:8080/job/kristofer15-tictactoe-DeployStage/
    - Purpose: Deploy the image create by the CommitStage to the Amazon server if the previous stage was successful.
  - AcceptanceStage
    - URL: http://82.221.49.96:8080/job/kristofer15-tictactoe-AcceptanceStage/
    - Purpose: Pull any changes made to the project if the DeployStage was successful, clean any previous change made to it and reinstall dependencies. Use the fresh code to perform API tests on the website.
  - CapacityStage
    - URL: http://82.221.49.96:8080/job/kristofer15-tictactoe-CapacityStage/
    - Purpose: Pull any changes made to the project if the AcceptanceStage was successful, clean any previous change made to it and reinstall dependencies. Use the fresh code to perform load tests by repeating the API test rapidly against the website.


## Additional Jenkins features
- Schedule or commit hooks
  - A hook was made so that the CommitStage is performed any time a change is pushed to Github. Leads to running all stages if they are successful.

- Pipeline
  - Implemented
  - URL: http://82.221.49.96:8080/view/kristofer15-tictactoe-pipeline
- Jenkins file
  - Not implemented.
- Test reports
  - Implemented for the CommitStage. Exports an XML which specifies the success of server side unit tests. Overview is visible at http://82.221.49.96:8080/job/kristofer15-tictactoe-CommitStage/test/
- Other


## Monitoring
- No monitoring was implemented

## Other

### Possible improvements
If I had more time I would complete UI testing, which I expect to do just past the hand-in time. After that I would create the provisioning script and use it to improve the seperation and sanitation of Jenkins stages. After that I would improve TictactoeGame.js that was provided as it does not seem to behave as intended and I would attempt to implement monitoring
