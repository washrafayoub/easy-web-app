FROM nginx:alpine
# Install tools required for project

# Copy required files
RUN pwd
CMD cd home
RUN pwd
CMD ls
RUN mkdir my_code
RUN cd my_code
RUN ls
#COPY . /app
#RUN cd /app
#RUN ls
#RUN which npm
CMD npm install
RUN ls
RUN cd example
RUN ls
#COPY static /usr/share/nginx/html
LABEL maintainer = "WalaaAshrafAyoub@gmail,com"
#CMD npm install
