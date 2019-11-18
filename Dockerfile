# stage 1
FROM node:latest as node 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/vehicle-frontend /usr/share/nginx/html

## Set the permission for NGINX web folder
RUN chmod 777 -R /usr/share/nginx/html

COPY --from=node /app/dist/vehicle-frontend/custom-nginx-file.conf /etc/nginx/conf.d/default.conf
## Expose the docker port
EXPOSE 8080
## Initiate the NGINX
CMD ["nginx", "-g", "daemon off;"]