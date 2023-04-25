# Typescript
FROM arm64v8/node:19-alpine as build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Run prod
FROM arm64v8/node:19-alpine as prod

ENV NODE_ENV="prod"
ENV TZ="Europe/Rome"

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only-production

COPY --from=build /usr/src/app/dist ./dist

COPY resources ./resources

CMD ["node", "dist/index.js"]
