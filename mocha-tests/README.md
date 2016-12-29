## How To Run Functional Tests

Prepare: 
1. `sudo npm install -g mocha`
2. `npm install zombie`

Run Test:

    for i in test/*; do mocha -t 10000 $i; done

Sorry, that won't work: `mocha --recursive`


## Write Tests

Docu: http://zombie.js.org/
