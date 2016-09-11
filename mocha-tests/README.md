## How To Run Functional Tests

Prepare: 
1. `sudo npm install -g mocha`
2. `npm install zombie`

Run Test:

    for i in test/*; do mocha $i; done

Sorry, that won't work: `mocha --recursive`
