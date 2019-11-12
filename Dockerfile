# base image
FROM node:latest as node

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . .
RUN npm install
RUN npm install -g @angular/cli@7.3.9
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist /usr/share/ngnix/html

CMD ng serve --host 0.0.0.0