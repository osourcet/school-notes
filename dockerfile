FROM node:15.4.0-alpine3.10 

COPY . /school-notes/

EXPOSE 3000

# RUN npm install node-pre-gyp -g

WORKDIR /school-notes/
RUN npm install --save
# RUN chmod +x docker.sh
CMD [ "npm", "run", "install-server", "&&", "npm", "run", "run-server" ]