FROM nginx:alpine
# Install tools required for project

# Copy required files
CMD pwd
CMD cd home
CMD pwd
CMD ls
CMD mkdir my_code
CMD cd my_code
CMD ls
#COPY . /app
#RUN cd /app
#RUN ls
#RUN which npm
CMD npm install
CMD ls
CMD cd example
CMD ls
#COPY static /usr/share/nginx/html
LABEL maintainer = "WalaaAshrafAyoub@gmail,com"
#CMD npm install
