#Test examples

##Create game command
###Create a game
- **Given**:
- **When**: createGame
- **Then**: GameCreated

##Join game command

###Join an open game
- **Given**: GameCreated
- **When**: joinGame
- **Then**: GameJoined

###Join a full game
- **Given**: GameCreated, GameJoined
- **When**: joinGame
- **Then**: FullGameJoinAttmpted

##Place move command

###Place legal move X
- **Given**: gameCreated
- **When**: placeMove(0,0,'X')
- **Then**: MovePlaced(0,0,'X')

###Place legal move O
- **Given**: GameCreated, GameJoined
- **When**: placeMove(0,1,'O')
- **Then**: movePlaced(0,0,'O')

###Place illegal move X
- **Given**: GameCreated, MovePlaced(0,1,'O')
- **When**: placeMove(0,1,'X')
- **Then**: IllegalMoveAttempted

###Place illegal move O
- **Given**: GameCreated, GameJoined, MovePlaced(0,0,'X')
- **When**: placeMove(0,0,'O')
- **Then**: IllegalMoveAttempted

###Illegally replace own move
- **Given**: GameCreated, GameJoined, MovePlaced(0,0,'X')
- **When**: placeMove(0,0,'X')
- **Then**: IllegalMoveAttempted

###Place move out of bounds
- **Given**: GameCreated
- **When**: placeMove(3,3,'X')
- **Then**: IllegalMoveAttempted

###Making a move when it's not the players turn
- **Given**: GameCreated, GameJoined, Move('X')
- **When**: placeMove(0,0,'O')
- **Then**: NotYourMove

##Winning the game

###Horizontal win
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- | 
|'X'|'X'|'X'|
|'O'|'O'|'-'|
|'-'|'-'|'-'|
            
- **Then**: GameWon('X')

###Vertical win
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'O'|'X'|
|'X'|'O'|'-'|
|'-'|'O'|'-'|

**Then**: GameWon('O')

###Diagonal win #1
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'-'|'-'|
|'O'|'X'|'-'|
|'-'|'O'|'X'|

**Then**: GameWon('X')

###Diagonal win #2
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'-'|'O'|
|'X'|'O'|'-'|
|'O'|'-'|'X'|

**Then**: GameWon('O')

##All tiles occupied

###All tiles occupied without a win
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'O'|'X'|
|'X'|'O'|'O'|
|'O'|'X'|'X'|

- **Then**: GameDraw

###All tiles occupied with a win
- **Given**: GameCreated, GameJoined
- **When**: Board:

| 0 | 1 | 2 |
| --- |:---:| --- |
|'X'|'O'|'O'|
|'X'|'X'|'O'|
|'O'|'X'|'X'|

-- **Then**: GameWon('X')
