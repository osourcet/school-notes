FROM node:15.4.0-alpine3.10 

COPY . /school-notes/

EXPOSE 3000

# RUN npm install node-pre-gyp -g

WORKDIR /school-notes/
RUN npm install --save
RUN npm run install-server
CMD [ "npm", "run", "run-server" ]