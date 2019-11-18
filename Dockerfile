# stage 1
FROM node:latest as node 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=8080

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html
## Set the permission for NGINX web folder
RUN chmod 777 -R /usr/share/nginx/html
COPY --from=node /app/dist/custom-nginx-file.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]