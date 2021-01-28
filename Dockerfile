# Install tools required for project
FROM node:latest
#ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
#RUN npm install --production
RUN npm install

COPY . .
#CMD [ "node", "server.js" ]
#RUN pwd
#RUN cd examples/simple
#RUN ls
#RUN node index.js
RUN node examples/simple/index.js
RUN echo 'THIS_IS_A_TEST_STATEMENT'
#RUN echo 'This_is_the_mail_contents' | mail -s "HOOOHOOOHOOO" walaaashrafayoub@gmail.com
#CMD [ "node", "index.js" ]
#CMD [ "echo", "THIS IS A TEST STATEMENT" ]

### OTHER CODE GOES HERE
#FROM nginx:alpine
## Copy required files
##RUN which npm
#RUN npm install
##RUN ls
#CMD cd example/simple
##RUN ls
#CMD node index.js
#CMD firefox http://localhost:8888/
#CMD echo "This is the mail contents.\n From dockers with love" | mail -s "HOOOHOOOHOOO" walaaashrafayoub@gmail.com
#CMD echo "THIS IS  A TEST STATEMENT"
LABEL maintainer = "WalaaAshrafAyoub@gmail.com"
