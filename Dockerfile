# Install tools required for project
#FROM node:latest
FROM node:8.9.4
#FROM node:12.12.0
#ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
#RUN npm install --production
#RUN npm install

COPY . .
RUN npm install
#CMD [ "node", "server.js" ]
#RUN pwd
#CMD cd examples/simple
#RUN ls
#RUN node index.js
#RUN node examples/simple/index.js
RUN echo 'THIS_IS_A_TEST_STATEMENT'
#RUN echo 'This_is_the_mail_contents' | mail -s "HOOOHOOOHOOO" walaaashrafayoub@gmail.com
#CMD [ "node", "index.js" ]
#CMD [ "echo", "THIS IS A TEST STATEMENT" ]

### Fix the permission issue of a file ##
#RUN apt-get update && apt-get install -y apt-utils vim curl
RUN chmod +x run_tests.sh
RUN ls -al
###

LABEL maintainer = "WalaaAshrafAyoub@gmail.com"
