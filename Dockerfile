FROM node 

ENV MONGO_DB_USERNAME=admin \
 MONGO_DB_PWD=qwerty

RUN mkdir -p CYEMPTIVE

COPY . /CYEMPTIVE


CMD ["node", "/CYEMPTIVE/index.js"]