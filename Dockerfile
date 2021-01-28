FROM nginx:alpine
# Install tools required for project

# Copy required files
#RUN pwd
#CMD cd home
#RUN pwd
#CMD ls
#RUN mkdir my_code
#RUN cd my_code
#RUN ls
#COPY . /app
#RUN cd /app
#RUN ls
#RUN which npm
RUN npm install
#RUN ls
CMD cd example/simple
#RUN ls
CMD node index.js
CMD firefox http://localhost:8888/
CMD echo "This is the mail contents.\n From dockers with love" | mail -s "HOOOHOOOHOOO" walaaashrafayoub@gmail.com
CMD echo "THIS IS  A TEST STATEMENT"
#COPY static /usr/share/nginx/html
LABEL maintainer = "WalaaAshrafAyoub@gmail,com"
#CMD npm install
