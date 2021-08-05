FROM node:16-alpine

COPY ./ app/

WORKDIR app/

RUN npm install --deploy

ENTRYPOINT ["npm", "run", "start-prod"]
