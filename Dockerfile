# Typescript
FROM arm64v8/node:19 as build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Run prod
FROM arm64v8/node:19 as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only-production

COPY --from=build /usr/src/app/dist ./dist

COPY resources ./resources

CMD ["node", "dist/index.js"]
