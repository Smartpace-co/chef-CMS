# Stage 1

FROM node:14-alpine as build-step
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

# Stage 2
FROM nginx:1.21.1-alpine
COPY ./dist/ /usr/share/nginx/html/