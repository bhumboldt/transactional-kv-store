# Roadmap

## Features I would add
1. A command to show the current state of the store
2. A command to show the current changes to the state for the current transaction
3. The ability to batch commands through a file instead of line by line
4. Better error messaging (instead of the blanket one I use now) -- like "Invalid arguments for SET, use is: SET <key> <value>" or "You typed "se" did you mean to use SET?"
5. This goes against the user requirements, but I think allowing case insensitive command could be good for end user usability

## Things I would do differently
1. Tests!
2. Use something like another map the make the COUNT command more time efficient (but less space efficient) -- for O(1) retreival instead of O(N)
3. Put the command processing, utility functions into other files, so as to keep the main file more readable (and focused on one thing)
4. You don't normally commit the build folder, but I wanted to get something to you that you could run without TypeScript :)