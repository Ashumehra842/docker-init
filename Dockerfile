FROM node 

RUN mkdir -p ./testapp

WORKDIR ./testapp

COPY . .

RUN npm install

CMD ["npm", "start"]