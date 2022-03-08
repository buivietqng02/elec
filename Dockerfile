FROM node:16.13 AS builder

WORKDIR /var/xm/

COPY . .

RUN npm install
RUN yarn run build
RUN ls -l 


FROM nginx:latest

WORKDIR /usr/share/nginx/html/

COPY --from=builder . .
RUN ls -l 

