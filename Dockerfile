# Install tools required for project
FROM node:latest AS node_base

RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version

FROM php:5.6-apache
COPY --from=node_base . .

### OTHER CODE GOES HERE
FROM nginx:alpine

# Copy required files
#RUN which npm
RUN npm install
#RUN ls
CMD cd example/simple
#RUN ls
CMD node index.js
CMD firefox http://localhost:8888/
CMD echo "This is the mail contents.\n From dockers with love" | mail -s "HOOOHOOOHOOO" walaaashrafayoub@gmail.com
CMD echo "THIS IS  A TEST STATEMENT"
LABEL maintainer = "WalaaAshrafAyoub@gmail,com"
