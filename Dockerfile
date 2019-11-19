# stage 1
FROM node:latest as node 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html

## Set the permission for NGINX web folder
RUN chmod 777 -R /usr/share/nginx/html

COPY --from=node /app/dist/custom-nginx-file.conf /etc/nginx/conf.d/default.conf

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=8080

## Expose the docker port
EXPOSE 8080
## Initiate the NGINX
CMD ["nginx", "-g", "daemon off;"]