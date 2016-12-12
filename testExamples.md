#Test examples

##Placing moves

###Place legal move X
- **Given**: gameCreated
- **When**: placeMove(0,0,'X')
- **Then**: movePlaced(0,0,'X')

###Place legal move O
- **Given**: gameCreated, gameJoined
- **When**: placeMove(0,1,'O')
- **Then**: movePlaced(0,0,'O')

###Place illegal move X
- **Given**: gameCreated, movePlaced(0,1,'O')
- **When**: placeMove(0,1,'X')
- **Then**: illegalMoveAttempted

###Place illegal move O
- **Given**: gameCreated, gameJoined, movePlaced(0,0,'X')
- **When**: placeMove(0,0,'O')
- **Then**: illegalMoveAttempted

###Illegally replace own move
- **Given**: gameCreated, gameJoined, movePlaced(0,0,'X')
- **When**: placeMove(0,0,'X')
- **Then**: illegalMoveAttempted

###Place move out of bounds
- **Given**: gameCreated
- **When**: placeMove(3,3,'X')
- **Then**: illegalMoveAttempted

###Making a move when it's not the players turn
- **Given**: gameCreated, gameJoined, turn('X')
- **When**: placeMove(0,0,'O')
- **Then**: illegalMoveAttemped

##Winning the game

###Horizontal win
- **Given**: gameCreated, gameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- | 
|'X'|'X'|'X'|
|'O'|'O'|'-'|
|'-'|'-'|'-'|
            
- **Then**: gameWon('X')

###Vertical win
- **Given**: gameCreated, gameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'O'|'X'|
|'X'|'O'|'-'|
|'-'|'O'|'-'|

**Then**: gameWon('O')

###Diagonal win #1
- **Given**: gameCreated, gameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'-'|'-'|
|'O'|'X'|'-'|
|'-'|'O'|'X'|

**Then**: gameWon('X')

###Diagonal win #2
- **Given**: gameCreated, gameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'-'|'O'|
|'X'|'O'|'-'|
|'O'|'-'|'X'|

**Then**: gameWon('O')
