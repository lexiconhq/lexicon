FROM keymetrics/pm2:18-alpine

WORKDIR /app

ARG NODE_ENV production
ENV NODE_ENV $NODE_ENV

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY tsconfig.json ./
COPY ./src ./src

RUN yarn generate

RUN yarn build

COPY pm2.json .

CMD ["pm2-runtime", "start", "pm2.json"]
