FROM node:8.10.0-alpine

ENV NODE_ENV=production

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

RUN apk add --no-cache --virtual git

WORKDIR /edirectinsure

ADD / ./

RUN npm install

# Run the container under "node" user by default
USER node

CMD ["npm", "start"]
