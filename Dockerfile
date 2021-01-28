# Install tools required for project
FROM node:latest
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD [ "node", "server.js" ]
CMD cd example/simple
CMD [ "node", "index.js" ]
CMD [ "echo", "THIS IS  A TEST STATEMENT" ]


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
#LABEL maintainer = "WalaaAshrafAyoub@gmail,com"
