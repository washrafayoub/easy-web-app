#!/bin/sh

for i in `ls mocha-tests/test/`; do
  echo $i
done


### Start running testcases ###
cd mocha-tests
echo "FLAG 1"
npm install -g mocha
echo "FLAG 2"
npm install zombie
echo "FLAG 3"

## The config test must be done separately:
#cd config-test
#mocha -t 10000 config.js
#cd ../

### Run the tests
#for i in test/*; do
#  echo "TestName: $i"
#  mocha -t 10000 $i
#  echo "Exit Status: $?"
#done
mocha -t 10000 test/wiki-demo.js
############
#echo 'FINISHED TESTING'
