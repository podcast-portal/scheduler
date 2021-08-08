FROM node:16-alpine

RUN apk update

COPY ./ app/

WORKDIR app/

RUN npm install --deploy
RUN npm run build

ENTRYPOINT ["npm", "run", "start-prod"]
