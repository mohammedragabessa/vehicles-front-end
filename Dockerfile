# base image
FROM node:12.2.0

# # install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./
RUN npm install
RUN npm install -g @angular/cli@7.3.9

# add app
COPY . .

RUN npm run build

FROM nginx:1.16.0-alpine as prod-stage

COPY --from=build-step /app/dist/vehiclesfrontend /usr/share/nginx/html

EXPOSE 80
# start app
CMD ["nginx","-g","daemon off:"]